import psycopg2
import logging
import os
import json

from dotenv import load_dotenv
from datetime import datetime, date
from decimal import Decimal
from pytz import timezone
# from web_scraper import Scraper

# logging for database.log
db_logger = logging.getLogger("database")
db_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("database.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
db_logger.addHandler(file_handler)
db_logger.addHandler(console_handler)

# globals 
NEXT_WEEK = 7
LIVE = 1
OLD = 0
DAY_TABLE = 'days_count'
HOUR_TABLE = 'hourly_count'
ALLOWED = {DAY_TABLE, HOUR_TABLE}
load_dotenv()

# supa db creds
HOST = os.environ.get("DBHOST")
DB = os.environ.get("DBNAME")
USER = os.environ.get("DBUSER")
PASS = os.environ.get("DBPASSWORD")
PORT = os.environ.get("DBPORT")
print(f"Connecting to Database: {DB} on {HOST}:{PORT} with user {USER}")
class Database():
    # basic constructer starting database connection with psycopgg
    def __init__(self) -> None:
        self.local_time = timezone("America/Los_Angeles")
        self.connection = psycopg2.connect( 
            host = HOST, 
            dbname = DB, 
            user = USER,
            password = PASS, 
            port = PORT,
            keepalives = 1, # heart beat pings to prove server is still alive
            keepalives_idle = 30, # if no queries in 30 seconds, send a ping
            keepalives_interval = 10, # every 10 seconds 
            keepalives_count = 3 # 3 attempts before properly closing (in case connection is actually broken)
        )
        self.cursor = self.connection.cursor()
        db_logger.info("Starting connections to database!")
        # main connection, has plently of built ins to talk to db

    # on start, CREATES days_count and hourly_count TABLES if they don't exist
    def start(self) -> None:
        days_table_query = """
            CREATE TABLE IF NOT EXISTS days_count (
                id INT PRIMARY KEY,
                date DATE NOT NULL,
                status SMALLINT NOT NULL CHECK (status IN (0, 1)),  -- 0 = Old, 1 = Live
                day_of_week VARCHAR(10) NOT NULL
            );
        """ 
        hourly_table_query = """
            CREATE TABLE IF NOT EXISTS hourly_count (
                id SERIAL PRIMARY KEY,  -- auto-increment
                day_id INT NOT NULL REFERENCES days_count(id),
                hour SMALLINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
                minute SMALLINT NOT NULL CHECK (minute IN (0, 30)),
                crowd_count SMALLINT NOT NULL,
                timestamp TIMESTAMP NOT NULL
            );
        """
        weekly_table_query = """
            CREATE TABLE IF NOT EXISTS weekly_count (
                id SERIAL PRIMARY KEY,
                day_of_week TEXT NOT NULL CHECK (
                    day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')   
                ),
                hour INTEGER NOT NULL CHECK (hour BETWEEN 0 AND 23),
                minute INTEGER NOT NULL CHECK (minute IN (0, 30)),
                average_crowd_count FLOAT NOT NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        try:
            db_logger.info("Sent days, and hourly table to Database!")
            self.send_query(days_table_query)
            self.send_query(hourly_table_query)
            self.send_query(weekly_table_query)
        except Exception as e:
            db_logger.info("Failed to send Tables to Database: ", e)
        return

    # on call, disconnects any and all connections
    def exit(self) -> None: 
        try:
            db_logger.info("Closing cursor and connection to Database!")
            self.cursor.close()
            self.connection.close()        
        except Exception as e:
            db_logger.warning(f"Error exiting connections: {e}")

    # helper for sending queries
    def send_query(self, query: str, id=None) -> None:
        # using %s for modifying queries prevents prompt injection
        try:
            if id is not None:
                self.cursor.execute(query, (id,)) # if id is given, add it while sending
            else:
                self.cursor.execute(query)
            self.connection.commit()
        except Exception as error:
            db_logger.warning(f"Error sending query to database: {error}")

    # helper for reading 1 row from response O(1)
    def read_one(self) -> tuple:
        return self.cursor.fetchone()
    
    # helper for reading all from responses O(n)
    def read_all(self) -> list[tuple]:
        return self.cursor.fetchall()
    
    # helper for deleting rows from given table and range
    def delete_by_id(self, table: str, id: int) -> None: # delete rows based on ID from days_count table
        if table not in ALLOWED: # prevents prompt injection 
            return 
        
        delete_query = f"""
            DELETE FROM {table} WHERE id = %s; 
        """
        db_logger.info(f"DATABASE Deleting {id} from {table}")
        self.send_query(delete_query, id)
        return

    # helper for checking if given id exist in days_count table
    def check_id(self, id: int) -> bool: # check if current ID is already in days_count table
        id_check_query = """
            SELECT * FROM days_count WHERE id = %s
        """
        db_logger.info("DATABASE's Check ID Query Sent!")
        self.send_query(id_check_query, id)
        if self.read_one():
            return True
        return False
    
    # helper for getting current date, day_id, and day of week 
    def get_curr_day(self) -> None: 
        current_datetime = datetime.now(self.local_time) # manuel set up for PST time
        #date_dict = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7} 
        
        day_of_week = current_datetime.strftime("%A")
        date = current_datetime.strftime("%Y-%m-%d")
        live_id = self.get_live()

        db_logger.info("Getting current day data!")
        return {
            'date': date, 
            'live_id': live_id, 
            'day_of_week': day_of_week
        }
    
    # helper for updating value of status column to OLD - 0
    def update_status(self, id: int) -> None:
        # assuming id exist, send query to update status to 0 based on specfic id
        update_query = """
            UPDATE days_count SET status = 0 WHERE id = %s
        """
        db_logger.info("Updating previous days status")
        self.send_query(update_query, id)
        return

    # helper for deleting oldest week of data from days_count and hourly_count tables
    def delete_oldest(self) -> None:
        try:
            # find the oldest 7 days (1 week) based on the `id` in `days_count`
            oldest_days_query = """
                SELECT id FROM days_count
                ORDER BY date ASC
                LIMIT 7
            """
            self.send_query(oldest_days_query)
            oldest_ids = [row[0] for row in self.read_all()]

            if not oldest_ids:
                db_logger.info("No data to delete.")
                return

            # delete corresponding rows from `hourly_count` for the oldest days
            delete_hourly_query = """
                DELETE FROM hourly_count
                WHERE day_id = ANY(%s)
            """
            self.cursor.execute(delete_hourly_query, (oldest_ids,))
            db_logger.info(f"Deleted hourly data for day_ids: {oldest_ids}")

            # delete the oldest days from `days_count`
            delete_days_query = """
                DELETE FROM days_count
                WHERE id = ANY(%s)
            """
            self.cursor.execute(delete_days_query, (oldest_ids,))
            db_logger.info(f"Deleted oldest days from days_count with ids: {oldest_ids}")

            self.connection.commit()
        except Exception as e:
            db_logger.warning(f"Failed to delete oldest week of data: {e}")
    
    # helper for checking if there are more than 15 "Monday" in days_count table
    def check_count(self) -> bool:
        count_query = """
            select COUNT(id)
            from days_count
            where day_of_week = 'Monday'
        """
        self.send_query(count_query)
        count = self.read_one()[0]
        if int(count) >= 15:
            return True
        return False

    # sends a SQL query to days_count table - SHOULD BE DONE EVERY DAY 
    def send_new_day(self) -> None:
        curr_day = self.get_curr_day()
        date = curr_day['date']
        day_of_week = curr_day['day_of_week']
        prev_id = curr_day['live_id']
        day_id = prev_id + 1

        # if more than 15 "Monday" (4 months present), delete oldest week - TO DO TASK
        if self.check_count():
            db_logger.info(f"Deleting oldest week of data in database!")
            self.delete_oldest()
            return 
        
        # when sending new day query, edit previous day's status to 0 (not collecting anymore)
        if prev_id != 1 and self.check_id(prev_id): 
            self.update_status(prev_id) # prev day id ASSUMING IT EXIST

        add_day_query = """
            INSERT INTO days_count(id, date, status, day_of_week)
            VALUES (%s, %s, %s, %s)
        """
        db_logger.info("Sending new day to Database!")
        self.cursor.execute(add_day_query, (day_id, date, LIVE, day_of_week))
        self.connection.commit()
        return
    
    # helper for rounding to closest 0 or 30 - NEEDED FOR HOURLY TABLE
    def round_minute(self, minute: str) -> int: # rounding to nearest 0 or 30
        if minute <= 15 or minute > 45:
            return 0
        return 30
    
    # function should return id from days_count table that has status = 1, ACTIVE DAY
    def get_live(self) -> int:
        get_live_query = """
            select id from days_count WHERE status = 1
        """
        self.send_query(get_live_query)
        id = self.read_one()
        if id == None:
            return 1
        return id[0]
    
    # sends query to add crowd count into hourly_count table
    def send_hourly_count(self, crowd_data: dict[str, int | str]) -> None: # sending hourly count 
        day_id = self.get_curr_day()['live_id']
        hour = crowd_data['hour'] 
        minute = crowd_data['minute']
        crowd_count = crowd_data['crowd_count']   
        timestamp = crowd_data['timestamp']

        # check if days_count table has day_id, if not don't send?? 
        if not self.check_id(day_id):
            db_logger.info(f"Table DOESN'T HAVE {day_id} NOT SENDING")
            return
        
        add_hour_query = """
            INSERT INTO hourly_count(day_id, hour, minute, crowd_count, timestamp)
            VALUES(%s, %s, %s, %s, %s)
        """
        try:
            db_logger.warning("Sent hourly data to Database!")
            self.cursor.execute(add_hour_query, (day_id, hour, self.round_minute(minute), crowd_count, timestamp))
            self.connection.commit()       
        except Exception as e:
            db_logger.warning(f"Failed to insert hourly data into Database: {e}")    
        return
    
   
    # function should return a dict with id, day_of_week, status, timestamp (date), and a list with [hour, minute, crowd_count, timestamp (when collected)]
    def get_daily_query(self) -> dict:
        id_query = """
            select * from days_count where status = 1
        """
        try:
            db_logger.info('Sent LIVE query to Database!')
            self.send_query(id_query)
        except Exception as e:
            db_logger.info('Failed to send LIVE query into Database: ', e)

        live_day = self.read_one()
        id = live_day[0]
        date = live_day[1]
        day_of_week = live_day[3]
        #print(id, date, day_of_week)

        day_query = """
            select day_id, hour, minute, crowd_count, timestamp from hourly_count where day_id = %s
        """
        try:
            db_logger.warning('Sent get_daily_query to Database!')
            self.send_query(day_query, (id,))
        except Exception as e:
            db_logger.warning('Failed to send get_daily_query to Database: ', e)
        
        #db_logger.info("Sent Day Query!")
        day_data = self.read_all()
        hourly_data = []
        for row in day_data:
            hourly_dict = {}
            day_id = row[0]
            if day_id is not None:
                hourly_dict['day_id'] = day_id
                hourly_dict['hour'] = row[1]
                hourly_dict['minute'] = row[2]
                hourly_dict['crowd_count'] = row[3]
                hourly_dict['timestamp'] = row[4]
            hourly_data.append(hourly_dict)
            
        return {
            'id': id,
            'date': date,
            'status': LIVE,
            'day_of_week': day_of_week,
            'hourly_data': hourly_data
        }
    
    # function should update weekly table once a day with new data from hourly table
    def update_weekly_query(self) -> None:
        try:
            gym_capacity = 150
            n = 7  # Total data points we assume for the average (1 per weekday, weekly average)
            
            curr_day_data = self.get_daily_query()
            day_of_week = curr_day_data['day_of_week']
            hourly_data = curr_day_data['hourly_data']

            db_logger.info(f"Updating weekly_count table for {day_of_week}")

            previous_average_query = """ 
                SELECT hour, minute, average_crowd_count
                FROM weekly_count
                WHERE day_of_week = %s
                ORDER BY hour, minute;
            """
            self.send_query(previous_average_query, (day_of_week,))
            previous_averages = self.read_all()

            # loop by index to combine current data with previous averages
            for i, hour_data in enumerate(hourly_data):
                hour = hour_data['hour']
                minute = hour_data['minute']
                raw_count = hour_data['crowd_count']

                # normalize based on max capacity (stored as %)
                normalized_count = round((raw_count / gym_capacity) * 100, 2)

                if i < len(previous_averages):
                    prev_hour, prev_minute, prev_avg = previous_averages[i]

                    # calculate rolling average
                    updated_avg = round(((prev_avg * (n - 1)) + normalized_count) / n, 2)

                    update_query = """
                        UPDATE weekly_count
                        SET average_crowd_count = %s, last_updated = CURRENT_TIMESTAMP
                        WHERE day_of_week = %s AND hour = %s AND minute = %s;
                    """
                    self.cursor.execute(update_query, (updated_avg, day_of_week, hour, minute))
                    self.connection.commit() 
                    db_logger.info(f"Updated {day_of_week} {hour}:{minute} -> {updated_avg}%")
                else:
                    # if entry doesn't exist, insert it
                    insert_query = """
                        INSERT INTO weekly_count (day_of_week, hour, minute, average_crowd_count)
                        VALUES (%s, %s, %s, %s);
                    """
                    self.cursor.execute(insert_query, (day_of_week, hour, minute, normalized_count))
                    self.connection.commit() 
                    db_logger.info(f"Inserted new {day_of_week} {hour}:{minute} -> {normalized_count}%")

            db_logger.info(f"weekly_count table successfully updated for {day_of_week}")

        except Exception as e:
            db_logger.warning(f"Failed to update weekly_count table: {e}")


    # get all previous weeks data to graph (same logic as get_daily but with all 7 days)
    def get_weekly_query(self) -> list:
        weekly_query = """
            SELECT * FROM weekly_count
            ORDER BY
            CASE day_of_week
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
            END,
            hour,
            minute;
        """

        try:    
            db_logger.warning("Sent get_weekly_query to Database!")
            self.send_query(weekly_query)
        except Exception as e:
            db_logger.warning("Error sending get_weekly_query to Database: ", e)
        weekly_data = self.read_all()
        # write_to_json(rows)
        #print(rows)
        final_data = {}
        for row in weekly_data:
            day = row[1] # day_of_week
            #print(day)
            if day not in final_data:
                final_data[day] = {
                    'day_of_week': day,
                    'hourly_data': []
                }
            
            if day is not None:
                hourly = {
                    'hour': row[2],
                    'minute': row[3],
                    'crowd_count': row[4],
                }
                final_data[day]['hourly_data'].append(hourly) # adding to query list

        day_list = list(final_data.values())
        return day_list



# TESTING 
# -----------------------------------------------------------------------------------
get_developers_query = """
    SELECT * FROM developers
"""
get_day_query = """
    SELECT * FROM days_count
"""
get_hour_query = """
    SELECT * FROM hourly_count
"""
get_weekly_query = """
    SELECT * FROM weekly_count
"""
join_query = """
    select * from days_count dc join hourly_count hc on dc.id = hc.day_id
"""
output_file = "beta/weekly.json"
def write_to_json(data, file_name=output_file):
    # Ensure the directory for the file exists if any directory is specified
    if os.path.dirname(file_name):
        os.makedirs(os.path.dirname(file_name), exist_ok=True)

    # Write data to the JSON file
    with open(file_name, 'w') as file:
        json.dump(data, file, indent=4, cls=DateTimeEncoder)

    print(f"\nData has been written to {file_name} successfully!\n")

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        elif isinstance(obj, Decimal):
            return float(obj)  # Converts Decimal to float for serialization
        return super().default(obj)
    
# internal testing
if __name__ == "__main__":
    db = Database()
    #scrape = Scraper()
    # id = db.get_live()
    # print(id)
    #db.start()
    # db.close()
    # db.send_query(get_developers_query)
    # dev_data = db.read_all()
    # for row in dev_data:
    #     print(row)
    
    db.update_weekly_query()
    
    # PLEASE DOUBLE CHECK BEFORE DELETING ITEMS
    #db.delete_by_id(DAY_TABLE, 2)
    #db.update_status(1)
    
    # db.send_new_day()

    # data = scrape.gym_scrape()
    # crowd_data = json.loads(data)
    # print(crowd_data)
    # db.send_hourly_count(crowd_data)
    

    # day_data = db.get_daily_query()
    # print(day_data)
    # for hour in day_data['hourly_data']:
    #     print(hour['crowd_count'])

    weeky_data = db.get_weekly_query()
    write_to_json(weeky_data)
    print(db.check_count())
    # db.initialize_weekly_table() # initialize weekly table with data from hourly_count table

    # checking weekly table
    # print("\nCHECKING ALL CONTENT IN WEEKLY_COUNT TABLE\n")
    # db.send_query(get_weekly_query)
    # weekly_data = db.read_all()
    # write_to_json(weekly_data, "beta/new_weekly.json")
    
    # checking days table
    # print("\nCHECKING ALL CONTENT IN DAY_COUNT TABLE\n")
    # db.send_query(get_day_query)
    # data = db.read_all()
    # print(data)

    # # checking hours table
    # print("\nCHECKING ALL CONTENT IN HOURLY_COUNT TABLE\n")
    # db.send_query(get_hour_query)
    # print(db.read_all())


    db.exit()