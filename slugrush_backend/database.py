import psycopg2
from datetime import datetime

class Database():
    def __init__(self):
        self.connection = psycopg2.connect( 
            host = "localhost", 
            dbname = "crowd_data", 
            user = "homies",
            password = "banana", 
            port = "5432"
        )
        self.cursor = self.connection.cursor()
    
    def close(self): # closes all connections
        self.connection.close()
        self.cursor.close()

    def delete_by_id(self, id): # Delete rows based on ID from days_count table
        self.cursor.execute(f"""
            DELETE FROM days_count WHERE id = {id};
        """)
        self.connection.commit()

    def checkID(self, id): # check if current ID is already in days_count table
        self.cursor.execute(f"""
            SELECT * FROM days_count WHERE id = {id}
        """)
        if self.cursor.fetchone():
            return True
        return False

    def add_new_day(self): # add a new row for current day into days_count table
        current_datetime = datetime.now()
        date = current_datetime.strftime("%Y-%m-%d")
        date_dict = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7} 
        day_of_week = current_datetime.strftime("%A")
        id = date_dict[day_of_week]
        
        if self.checkID(id) and self.checkID(id + 7): # if both ids exist 
            print("BOTH IDs EXIST IN DATABASE")
            return 
        
        if self.checkID(id): # if ID exist, add for next week
            print("ID EXIST")
            self.cursor.execute(f"""
                INSERT INTO days_count (id, date, status, day_of_week)
                VALUES ({id + 7}, '{date}', 1, '{day_of_week}')
            """)
        else: # if ID doesnt exist, current week 
            print("ID DOESNT EXIST")
            self.cursor.execute(f"""
                INSERT INTO days_count (id, date, status, day_of_week)
                VALUES ({id}, '{date}', 1, '{day_of_week}')
            """)
        self.connection.commit()
        return

get_day_query = """
    SELECT * FROM days_count
"""
get_hour_query = """
    SELECT * FROM hourly_count
"""
# testing_query = f"""
#     CREATE TABLE test (
#         id INT PRIMARY KEY,
#         name VARCHAR(255) NOT NULL,
#         msg VARCHAR(255) NOT NULL,
#     );
# """

# internal testing
if __name__ == "__main__":
    db = Database()
    # db.delete_by_id(14)
    db.add_new_day()
    db.close()