from apscheduler.schedulers.background import BackgroundScheduler
import requests
import json
import time
from database import Database

class Scheduler:
    def __init__(self) -> None:
        self.url = 'http://localhost:8000'
        self.scheduler = BackgroundScheduler()
        self.database = Database()

    def start_jobs(self) -> None:
        self.database.start()
        # TEMP - schedule the task to run every `interval` seconds - SWAP TO CRON LATER
        self.scheduler.add_job(self.post_new_day, 'interval', seconds=20) # add new table to db -- before start of new/end of day
        self.scheduler.add_job(self.post_hourly_count, 'interval', seconds=10) # scrape and add data to new table -- every 30 minutes within operation hours

        self.scheduler.start()
        print("Scheduler started...")

    def stop_jobs(self) -> None:
        print("Stopping the scheduler...")
        self.scheduler.shutdown()
        self.database.close()

    def display(self, job: str, msg: str) -> None:
        print(f"Executed {job} with Message: {msg}")

    def post_new_day(self) -> None:
        # Job for adding new row to days_count table
        print("SCHEDULER's Adding New Day Row...")
        self.database.add_new_day()
        return

    def get_hourly_count(self) -> dict[str, int | str] | None:
        # Job for fetching occupancy count 
        count_url = self.url + '/get/count'
        try:
            response = requests.get(count_url)
            if response.status_code == 200:
                #self.display('get_count', response.json())
                return response.json()
            else:
                print("Error with fetched data: ", response.status_code)
        except Exception as e:
            print("Error with fetching endpoint: ", e)

    def post_hourly_count(self) -> None:
        print("SCHEDULER's Adding New Hourly Row...")
        crowd_data = self.get_hourly_count()
        self.database.add_hourly_count(crowd_data)
        return


# internal testing
if __name__ == "__main__":
    scheduler = Scheduler()
    scheduler.start_jobs()  # Start the scheduler with a 5-second interval

    try:
        # Keep the program running to allow the scheduler to run tasks
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        # Handle the Ctrl+C interruption and stop the scheduler
        print("Scheduler interrupted by user!")
        scheduler.stop_jobs()
