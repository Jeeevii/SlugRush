import psycopg2
from datetime import datetime
import requests

NEXT_WEEK = 7
LIVE = 1
OLD = 0
DAY_TABLE = 'days_count'
HOUR_TABLE = 'hourly_count'

class Database():
    def __init__(self) -> None:
        self.connection = psycopg2.connect( 
            host = "localhost", 
            dbname = "crowd_data", 
            user = "homies",
            password = "banana", 
            port = "5432"
        )
        self.cursor = self.connection.cursor()

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


    def close(self) -> None: # closes all connections
        self.cursor.close()
        self.connection.close()

    def send_query(self, query: str) -> None:
        self.cursor.execute(query)
        self.connection.commit()

    def read_one(self) -> None:
        return self.cursor.fetchone()
    
    def read_all(self) -> None:
        return self.cursor.fetchall()
    
    def delete_by_id(self, table: str, start: int, end: int) -> None: # Delete rows based on ID from days_count table
        delete_query = f"""
            DELETE FROM {table} WHERE id = %s;
        """
        for i in range(start, end + 1):
            print(f"DATABASE Deleting {i} from {table}")
            self.cursor.execute(delete_query, (i,))
            self.connection.commit()
        return

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

    def add_new_day(self) -> None: # add a new row for current day into days_count table
        curr_day = self.get_day()
        date = curr_day['date']
        day_of_week = curr_day['day_of_week']
        id = curr_day['day_id']
        id += 1
        # if self.check_id(id) and self.check_id(id + NEXT_WEEK): # if both ids exist 
        #     print(f"Both {id} and {id + NEXT_WEEK} exist in database, not sending")
        #     return 
        
        if self.check_id(id): # if ID exist, add for next week
            print(f"{id} exists, adding for next week")
            id = id + NEXT_WEEK # next week
        else: # if ID doesnt exist, current week 
            print(f"{id} doesnt exist, adding to table")

        add_day_query = f"""
            INSERT INTO days_count(id, date, status, day_of_week)
            VALUES ({id}, '{date}', {LIVE}, '{day_of_week}')
        """
        print("DATABASE's Daily Query Sent!")
        self.send_query(add_day_query)
        return
    
    def round_minute(self, minute: str) -> int: # rounding to nearest 0 or 30
        if minute <= 15 or minute > 45:
            return 0
        return 30
    
    def add_hourly_count(self, crowd_data: dict[str, int | str]) -> None: # sending hourly count 
        day_data = self.get_day()
        day_id = day_data['day_id']

        hour = crowd_data['hour'] 
        minute = crowd_data['minute']
        crowd_count = crowd_data['crowd_count']   
        timestamp = crowd_data['timestamp']
        add_hour_query = f"""
            INSERT INTO hourly_count(day_id, hour, minute, crowd_count, timestamp)
            VALUES({day_id}, {hour}, {self.round_minute(minute)}, {crowd_count}, '{timestamp}')
        """
        print("DATABASE's Hourly Query Sent!")
        self.send_query(add_hour_query)              
        return

get_day_query = """
    SELECT * FROM days_count
"""
get_hour_query = """
    SELECT * FROM hourly_count
"""

def get_hourly_count() -> dict[str, int | str] | None: 
    # Job for fetching occupancy count 
    count_url = 'http://localhost:8000/get/count'
    try:
        response = requests.get(count_url)
        if response.status_code == 200:
            #self.display('get_count', response.json())
            return response.json()
        else:
            print("Error with fetched data: ", response.status_code)
    except Exception as e:
        print("Error with fetching endpoint: ", e)

# internal testing
if __name__ == "__main__":
    db = Database()
    #db.start()

    # PLEASE DOUBLE CHECK BEFORE DELETING ITEMS
    # db.delete_by_id(HOUR_TABLE, 13, 21)

    # db.add_new_day()
    # crowd_data = get_hourly_count()
    # db.add_hourly_count(crowd_data)
    
    # checking days table
    print("CHECKING ALL CONTENT IN DAY_COUNT TABLE\n")
    db.send_query(get_day_query)
    print(db.read_all())

    # checking hours table
    print("\nCHECKING ALL CONTENT IN HOURLY_COUNT TABLE\n")
    db.send_query(get_hour_query)
    print(db.read_all())

    db.close()