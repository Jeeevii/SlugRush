from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone
import os
from dotenv import load_dotenv
import json
import time
import logging
import requests

from database import Database
from web_scraper import Scraper
load_dotenv()

BACKEND_URL = os.environ.get("BACKEND_URL")
local_time = timezone("America/Los_Angeles") # render has different time zone

# scheduler logging 
scheduler_logger = logging.getLogger("scheduler")
scheduler_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("scheduler.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
scheduler_logger.addHandler(file_handler)
scheduler_logger.addHandler(console_handler)

class Scheduler:
    def __init__(self) -> None:
        self.scheduler = BackgroundScheduler(timezone=local_time)
        self.database = Database()
        self.scraper = Scraper()

    def start_jobs(self) -> None:
        self.database.start()
        # Daily at 12:00 AM
        self.scheduler.add_job(self.add_new_day, 'cron', hour=0, minute=0)
        # Weekdays: 6 AM to 11 PM every 30 min
        self.scheduler.add_job(self.add_hourly_count, 'cron', day_of_week="0-4", hour="6-23", minute="*/30")
        # Weekends: 8 AM to 8 PM every 30 min
        self.scheduler.add_job(self.add_hourly_count, 'cron', day_of_week="5-6", hour="8-20", minute="*/30")
        # Ping the main backend every 10 minutes to prevent idle timeout (15 minutes)
        self.scheduler.add_job(self.ping_backend, 'interval', minutes=5)
        
        self.scheduler.start()
        scheduler_logger.info("Scheduler started...")

    def stop_jobs(self) -> None:
        scheduler_logger.info("Stopping the scheduler...")
        self.scheduler.shutdown()
        self.database.exit()

    def display(self, job: str, msg: str) -> None:
        print(f"Executed {job} with Message: {msg}")

    def add_new_day(self) -> None:
        # JOB for adding new row to days_count table
        scheduler_logger.info("Executing ADD_NEW_DAY Task!")
        self.database.send_new_day()
        return

    def get_scraped_data(self) -> dict[str, int | str]:
        # JOB for fetching occupancy count 
        scraped_data = self.scraper.gym_scrape()
        return json.loads(scraped_data)

    def add_hourly_count(self) -> None:
        scheduler_logger.info("Executing ADD_HOURLY_COUNT Task!")
        crowd_data = self.get_scraped_data()
        self.database.send_hourly_count(crowd_data)
        return

    # task to prevent render server from idle and shutdown
    def ping_backend(self) -> None:
        try:
            scheduler_logger.warning("Executing PING_BACKEND Task!")
            response = requests.get(BACKEND_URL)
            if response.status_code == 200:
                scheduler_logger.warning("Ping successful: Backend is alive")
            else:
                scheduler_logger.warning(f"Ping failed with status code: {response.status_code}")
        except Exception as e:
            scheduler_logger.error(f"Ping failed with error: {e}")

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