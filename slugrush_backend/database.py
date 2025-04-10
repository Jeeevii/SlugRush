import psycopg2
from datetime import datetime
import json
from web_scraper import Scraper

NEXT_WEEK = 7
LIVE = 1
OLD = 0
DAY_TABLE = 'days_count'
HOUR_TABLE = 'hourly_count'

class Database():
    # basic constructer starting database connection with psycopgg
    def __init__(self) -> None:
        self.connection = psycopg2.connect( 
            host = "localhost", 
            dbname = "crowd_data", 
            user = "homies",
            password = "banana", 
            port = "5432"
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
        print("DATABASE's Days Table Query Sent!")
        self.send_query(days_table_query)

        print("DATABASE's Hourly Table Query Sent!")
        self.send_query(hourly_table_query)
        return

    # on call, disconnects any and all connections
    def close(self) -> None: 
        self.cursor.close()
        self.connection.close()

    # helper for sending queries
    def send_query(self, query: str) -> None:
        self.cursor.execute(query)
        self.connection.commit()

    # helper for reading 1 row from response O(1)
    def read_one(self) -> None:
        return self.cursor.fetchone()
    
    # helper for reading all from responses O(n)
    def read_all(self) -> None:
        return self.cursor.fetchall()
    
    # helper for deleting rows from given table and range
    def delete_by_id(self, table: str, start: int, end: int) -> None: # Delete rows based on ID from days_count table
        delete_query = f"""
            DELETE FROM {table} WHERE id = %s;
        """
        for i in range(start, end + 1):
            print(f"DATABASE Deleting {i} from {table}")
            self.cursor.execute(delete_query, (i,))
            self.connection.commit()
        return

    # helper for checking if given id exist in days_count table
    def check_id(self, id: int) -> bool: # check if current ID is already in days_count table
        id_check_query = f"""
            SELECT * FROM days_count WHERE id = %s
        """
        print("DATABASE's Check ID Query Sent!")
        self.cursor.execute(id_check_query, (id,))
        self.connection.commit()
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

        return {
            'date': date, 
            'day_id': day_id, 
            'day_of_week': day_of_week
        }

    # sends a SQL query to days_count table - SHOULD BE DONE EVERY DAY 
    def send_new_day(self) -> None:
        curr_day = self.get_day()
        date = curr_day['date']
        day_of_week = curr_day['day_of_week']
        id = curr_day['day_id']

        # when sending new day, edit previous day's status to 0 (not collecting anymore) - TO DO TASK
        
        new_id = id 
        if self.check_id(id): # if ID exist, add for next week
            print(f"{id} exists, adding for next week")
            new_id = id + NEXT_WEEK # next week
        else: # if ID doesnt exist, its current week 
            print(f"{id} doesnt exist, adding to table")

        
        # when both ids exist for monday, delete first week and update with second week - TO DO TASK
        # third weeks monday will be + 7 
        # if monday and both ids for monday exist, do logic
        if self.check_id(new_id):
            print(f"{new_id} also exist in database, deleting and swapping")
            return 
        
        add_day_query = f"""
            INSERT INTO days_count(id, date, status, day_of_week)
            VALUES ({new_id}, '{date}', {LIVE}, '{day_of_week}')
        """
        print("DATABASE's Daily Query Sent!")
        self.send_query(add_day_query)
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
            print(f"Table DOESN'T HAVE {day_id} NOT SENDING")
            return
        
        add_hour_query = f"""
            INSERT INTO hourly_count(day_id, hour, minute, crowd_count, timestamp)
            VALUES({day_id}, {hour}, {self.round_minute(minute)}, {crowd_count}, '{timestamp}')
        """
        print("DATABASE's Hourly Query Sent!")
        self.send_query(add_hour_query)              
        return
    
    # send query to database joining all content in 1 day (containing all crowd_count per hour, etc), return parsed and formatted dict
    def send_get_daily(self, crowd_data: dict[str, int | str]) -> dict:
        curr_day = self.get_day()
        date = curr_day['date']
        day_of_week = curr_day['day_of_week']
        id = curr_day['day_id']

        hour = crowd_data['hour'] 
        minute = crowd_data['minute']
        crowd_count = crowd_data['crowd_count']   
        timestamp = crowd_data['timestamp']

        join_query = """
            select * from days_count dc join hourly_count hc on dc.id = hc.day_id
        """
        print("Sent Joined Query!")
        self.send_query(join_query)
        joined_table = self.read_all()
        id_pk = joined_table[0][4]
        
        return {
            'id': id,
            'date': date,
            'status': LIVE,
            'day_of_week': day_of_week,
            'id_pk': id_pk,
            'day_id': id,
            'hour': hour,
            'minute': minute,
            'crowd_count': crowd_count,
            'timestamp': timestamp

        }







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
    #db.delete_by_id(DAY_TABLE, 3, 7)
    #db.delete_by_id(HOUR_TABLE, 3, 7)
    # db.send_new_day()
    data = scrape.gym_scrape()
    crowd_data = json.loads(data)
    # db.send_hourly_count(crowd_data)
    
    #checking days table
    print("\nCHECKING ALL CONTENT IN DAY_COUNT TABLE\n")
    db.send_query(get_day_query)
    print(db.read_all())

    # checking hours table
    print("\nCHECKING ALL CONTENT IN HOURLY_COUNT TABLE\n")
    db.send_query(get_hour_query)
    print(db.read_all())

    #db.send_get_daily(crowd_data)
    print(db.send_get_daily(crowd_data))

    db.close()