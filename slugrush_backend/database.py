import psycopg2
import logging
import json 
import os

from dotenv import load_dotenv
from datetime import datetime
from web_scraper import Scraper

NEXT_WEEK = 7
LIVE = 1
OLD = 0
DAY_TABLE = 'days_count'
HOUR_TABLE = 'hourly_count'
ALLOWED = {DAY_TABLE, HOUR_TABLE}
load_dotenv()

db_logger = logging.getLogger("database")
db_logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("database.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))

console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))

db_logger.addHandler(file_handler)
db_logger.addHandler(console_handler)

class Database():
    # basic constructer starting database connection with psycopgg
    def __init__(self) -> None:
        self.connection = psycopg2.connect( 
            host = os.environ.get("HOST"), 
            dbname = os.environ.get("DBNAME"), 
            user = os.environ.get("USER"),
            password = os.environ.get("PASSWORD"), 
            port = os.environ.get("PORT")
        )
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
        self.cursor.close()
        self.connection.close()

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
        id_check_query = f"""
            SELECT * FROM days_count WHERE id = %s
        """
        db_logger.info("DATABASE's Check ID Query Sent!")
        self.send_query(id_check_query, id)
        if self.read_one():
            return True
        return False
    
    # helper for getting current date, day_id, and day of week 
    def get_day(self) -> None: 
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
        update_query = f"""
            UPDATE days_count SET status = 0 WHERE id = %s
        """
        db_logger.info("Updating previous days status")
        self.send_query(update_query, id)
        return

    # sends a SQL query to days_count table - SHOULD BE DONE EVERY DAY 
    def send_new_day(self) -> None:
        curr_day = self.get_day()
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
        day_data = self.get_day()
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
        id_query = """
            select * from days_count where status = 1
        """
        self.send_query(id_query)
        #print("Sent id Query!")
        live_day = self.read_one()
        id = live_day[0]
        date = live_day[1]
        day_of_week = live_day[3]
        #print(id, date, day_of_week)

        day_query = f"""
            select day_id, hour, minute, crowd_count, timestamp from hourly_count where day_id = %s
        """
        self.cursor.execute(day_query, (id,))
        self.connection.commit()
        
        #print("Sent Day Query!")
        day_data = self.read_all()
        columns = ['day_id', 'hour', 'minute', 'crowd_count', 'timestamp']
        day_list = []
        for row in day_data: # monkey brain ahh logic but it works
            hourly_dict = {}
            i = 0
            for item in row:
                hourly_dict[columns[i]] = item
                i += 1
            day_list.append(hourly_dict)
            
        return {
            'id': id,
            'date': date,
            'status': LIVE,
            'day_of_week': day_of_week,
            'day_data': day_list
        }

    # get all previous weeks data to graph (same logic as get_daily but with all 7 days)
    def get_weekly_query(self) -> dict:

        id_query = """
            SELECT * FROM days_count WHERE id <= 7
        """
        self.send_query(id_query)
        print("Sent days_count query!")
        day_count_data = self.read_all()

        day_columns = ['id', 'date', 'status', 'day_of_week']
        day_list = []

        for row in day_count_data:
            day_dict = {day_columns[i]: row[i] for i in range(len(day_columns))}
            day_list.append(day_dict)

        day_map = {day['id']: day for day in day_list}

        hourly_query = """
            SELECT day_id, hour, minute, crowd_count, timestamp FROM hourly_count WHERE day_id <= 7
        """
        self.send_query(hourly_query)
        print("Sent hourly_count query!")
        hourly_data = self.read_all()

        hourly_columns = ['day_id', 'hour', 'minute', 'crowd_count', 'time_stamp']

        for row in hourly_data:
            hour_dict = {hourly_columns[i]: row[i] for i in range(len(hourly_columns))}
            day_id = hour_dict['day_id']

            if day_id in day_map:
                if 'hourly_data' not in day_map[day_id]:
                    day_map[day_id]['hourly_data'] = []
                day_map[day_id]['hourly_data'].append(hour_dict)

        return day_list





# TESTING 
# ------------------------------------------------------------------
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
    #db.start()

    # PLEASE DOUBLE CHECK BEFORE DELETING ITEMS
    #db.delete_by_id(DAY_TABLE, 4, 4)
    #db.update_status(2)
    
    #db.send_new_day()
    # data = scrape.gym_scrape()
    # crowd_data = json.loads(data)
    # db.send_hourly_count(crowd_data)
    
    #get_daily = db.get_day()
    #print(get_daily['day_data'][0])
    print(db.get_weekly_query())

    # # checking days table
    # print("\nCHECKING ALL CONTENT IN DAY_COUNT TABLE\n")
    # db.send_query(get_day_query)
    # print(db.read_all())

    # # checking hours table
    # print("\nCHECKING ALL CONTENT IN HOURLY_COUNT TABLE\n")
    # db.send_query(get_hour_query)
    # print(db.read_all())

    db.close()