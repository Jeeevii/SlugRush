import psycopg2
import logging
import os
import json

from dotenv import load_dotenv
from datetime import datetime
from web_scraper import Scraper

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
HOST = os.environ.get("HOST")
DB = os.environ.get("DBNAME")
USER = os.environ.get("USER")
PASS = os.environ.get("PASSWORD")
PORT = os.environ.get("PORT")

class Database():
    # basic constructer starting database connection with psycopgg
    def __init__(self) -> None:
        self.connection = psycopg2.connect( 
            host = HOST, 
            dbname = DB, 
            user = USER,
            password = PASS, 
            port = PORT
        )
        db_logger.info("Starting connections to database!")
        # main connection, has plently of built ins to talk to db
        self.cursor = self.connection.cursor()

    # on start, CREATES days_count and hourly_count TABLES if they don't exist
    def start(self) -> None:
        days_table_query = """
            CREATE TABLE IF NOT EXISTS days_count (
                id INT PRIMARY KEY,  -- 1–14 rotation
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
        try:
            db_logger.info("Sent days, and hourly table to Database!")
            self.send_query(days_table_query)
            self.send_query(hourly_table_query)
        except Exception as e:
            db_logger.info("Failed to send Tables to Database: ", e)
        return

    # on call, disconnects any and all connections
    def close(self) -> None: 
        db_logger.info("Closing connections to database!")
        try:
            if self.cursor and not self.cursor.closed:
                db_logger.info("Cursor is not closed, closing now!")
                self.cursor.close()
            if self.connection and self.connection.closed == 0:
                db_logger.info("Connection is not closed, closing now!")
                self.connection.close()
        except Exception as e:
            db_logger.warning(f"Error during close: {e}")
    
    # helper to avoid cursor idle connection loss 
    def reconnect(self):
        self.close()
        try:
            db_logger.warning("Reconnecting to database...")
            self.connection = psycopg2.connect( 
                host = HOST, 
                dbname = DB, 
                user = USER,
                password = PASS, 
                port = PORT
            )
            self.cursor = self.connection.cursor()
            db_logger.info("Reconnection successful.")
            # basic ping
            self.send_query("select id from days_count where status = 1")
        except Exception as e:
            db_logger.error(f"Failed to reconnect to database: {e}")

    # helper for sending queries
    def send_query(self, query: str, id=None) -> None:
        # using %s for modifying queries prevents prompt injection
        if id is not None:
            self.cursor.execute(query, (id,)) # if id is given, add it while sending
        else:
            self.cursor.execute(query)
        self.connection.commit()

    # helper for reading 1 row from response O(1)
    def read_one(self) -> tuple:
        return self.cursor.fetchone()
    
    # helper for reading all from responses O(n)
    def read_all(self) -> list[tuple]:
        return self.cursor.fetchall()
    
    # helper for deleting rows from given table and range
    def delete_by_id(self, table: str, start: int, end: int) -> None: # delete rows based on ID from days_count table
        if table not in ALLOWED: # prevents prompt injection 
            return 
        
        delete_query = f"""
            DELETE FROM {table} WHERE id = %s; 
        """
        for i in range(start, end + 1):
            db_logger.info(f"DATABASE Deleting {i} from {table}")
            self.send_query(delete_query, i)
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
        current_datetime = datetime.now()
        date_dict = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7} 
        
        day_of_week = current_datetime.strftime("%A")
        date = current_datetime.strftime("%Y-%m-%d")
        day_id = date_dict[day_of_week]

        db_logger.info("Getting current day data!")
        return {
            'date': date, 
            'day_id': day_id, 
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

    # sends a SQL query to days_count table - SHOULD BE DONE EVERY DAY 
    def send_new_day(self) -> None:
        # db_logger.info("Sending reconnect ping from send_new_day() to Database!")
        # self.reconnect()

        curr_day = self.get_curr_day()
        date = curr_day['date']
        day_of_week = curr_day['day_of_week']
        id = curr_day['day_id']
        
        new_id = id 
        if self.check_id(id): # if ID exist, add for next week
            db_logger.info(f"{id} exists, adding for next week")
            new_id = id + NEXT_WEEK
        else: # if ID doesnt exist, its current week 
            db_logger.info(f"{id} doesnt exist, adding to table")

        # when both ids exist for monday, delete first week and update with second week - TO DO TASK
        if self.check_id(new_id):
            db_logger.info(f"{new_id} also exist in database, deleting and swapping")
            return 
        
        # when sending new day query, edit previous day's status to 0 (not collecting anymore)
        if new_id != 1: 
            self.update_status(new_id - 1) # prev day id ASSUMING IT EXIST

        add_day_query = """
            INSERT INTO days_count(id, date, status, day_of_week)
            VALUES (%s, %s, %s, %s)
        """
        db_logger.info("Sending new day to Database!")
        self.cursor.execute(add_day_query, (new_id, date, LIVE, day_of_week))
        self.connection.commit()
        return
    
    # helper for rounding to closest 0 or 30 - NEEDED FOR HOURLY TABLE
    def round_minute(self, minute: str) -> int: # rounding to nearest 0 or 30
        if minute <= 15 or minute > 45:
            return 0
        return 30
    
    # sends query to add crowd count into hourly_count table
    def send_hourly_count(self, crowd_data: dict[str, int | str]) -> None: # sending hourly count 
        # db_logger.info("Sending reconnect ping from send_hourly_count() to Database!")
        # self.reconnect()

        day_data = self.get_curr_day()
        day_id = day_data['day_id']

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
            db_logger.info("Sent hourly data to Database!")
            self.cursor.execute(add_hour_query, (day_id, hour, self.round_minute(minute), crowd_count, timestamp))
            self.connection.commit()       
        except Exception as e:
            db_logger.info(f"Failed to insert hourly data into Database: {e}")    
        return
    
   
    # function should return a dict with id, day_of_week, status, timestamp (date), and a list with [hour, minute, crowd_count, timestamp (when collected)]
    def get_daily_query(self) -> dict:
        # db_logger.info("Sending reconnect ping from get_daily_query() to Database!")
        # self.reconnect()

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
            db_logger.info('Sent get_daily_query to Database!')
            self.cursor.execute(day_query, (id,))
            self.connection.commit()
        except Exception as e:
            db_logger.info('Failed to send get_daily_query to Database: ', e)
        
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

    # get all previous weeks data to graph (same logic as get_daily but with all 7 days)
    def get_weekly_query(self) -> dict:
        # db_logger.info("Sending reconnect ping from get_weekly_query() to Database!")
        # self.reconnect()

        weekly_query = """
            select dc.id, dc.date, dc.status, dc.day_of_week, 
            hc.day_id, hc.hour, hc.minute, hc.crowd_count, hc.timestamp
            from days_count dc
            left join hourly_count hc on dc.id = hc.day_id
            where dc.id <= 7
            ORDER BY dc.id, hc.hour, hc.minute
        """
        db_logger.info("Sent get_weekly_query to Database!")
        self.send_query(weekly_query)
        rows = self.read_all()
        #print(rows)
        final_data = {}
        for row in rows:
            day_id = row[0]
            if day_id not in final_data:
                final_data[day_id] = {
                    'id': row[0],
                    'date': row[1],
                    'status': row[2],
                    'day_of_week': row[3],
                    'hourly_data': []
                }
            
            if row[4] is not None:
                hourly = {
                    'day_id': row[4],
                    'hour': row[5],
                    'minute': row[6],
                    'crowd_count': row[7],
                    'timestamp': row[8]
                }
                final_data[day_id]['hourly_data'].append(hourly)

        day_list = list(final_data.values())
        return day_list





# TESTING 
# ------------------------------------------------------------------
get_developers_query = """
    SELECT * FROM developers
"""
get_day_query = """
    SELECT * FROM days_count
"""
get_hour_query = """
    SELECT * FROM hourly_count
"""
join_query = """
    select * from days_count dc join hourly_count hc on dc.id = hc.day_id
"""

# internal testing
if __name__ == "__main__":
    db = Database()
    scrape = Scraper()
    # db.start()
    #db.close()
    # db.send_query(get_developers_query)
    # dev_data = db.read_all()
    # for row in dev_data:
    #     print(row)

    
    # PLEASE DOUBLE CHECK BEFORE DELETING ITEMS
    #db.delete_by_id(DAY_TABLE, 4, 4)
    #db.update_status(13)
    
    #db.send_new_day()
    data = scrape.gym_scrape()
    crowd_data = json.loads(data)
    #print(crowd_data)
    db.send_hourly_count(crowd_data)
    

    # day_data = db.get_daily_query()
    # print(day_data)
    # for hour in day_data['hourly_data']:
    #     print(hour['crowd_count'])

    #weeky_data = db.get_weekly_query()
    # print(weeky_data[1]['hourly_data'][0]['crowd_count'])
    # for row in weeky_data:
    #     for hour in row['hourly_data']:
    #         print(hour)

    # checking days table
    print("\nCHECKING ALL CONTENT IN DAY_COUNT TABLE\n")
    db.send_query(get_day_query)
    print(db.read_all())

    # checking hours table
    print("\nCHECKING ALL CONTENT IN HOURLY_COUNT TABLE\n")
    db.send_query(get_hour_query)
    print(db.read_all())

    db.close()