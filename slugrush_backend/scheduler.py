from apscheduler.schedulers.background import BackgroundScheduler
import requests
import json
import time


class Scheduler:
    def __init__(self, scheduler):
        self.url = 'http://localhost:8000'
        self.scheduler = scheduler

    def start_jobs(self, interval=3):
        # TEMP - schedule the task to run every `interval` seconds
        self.scheduler.add_job(self.get_count, 'interval', seconds=interval)
        self.scheduler.start()
        print("Scheduler started...")

    def stop_jobs(self):
        print("Stopping the scheduler...")
        self.scheduler.shutdown()

    def display(self, msg):
        print(f"Scraped data: {msg}")

    def get_count(self):
        # Job for fetching occupancy count 
        count_url = self.url + '/get/count'
        try:
            response = requests.get(count_url)
            if response.status_code == 200:
                self.display(response.json())
            else:
                print("Error with fetched data: ", response.status_code)
        except Exception as e:
            print("Error with fetching endpoint: ", e)

    def post_crowd(self, count):
        # temp Job for posting fetched data
        post_url = self.url + '/post/crowd/'
        try:
            response = requests.post(post_url, json={
                'crowd_count': count
            })
            if response.status_code == 201:
                print("Sucessfully posting count: ", response.content)
            else:
                print("Error with posting data: ", response.status_code)
        except Exception as e:
            print("Error with posting endpoint: ", e)


# internal testing
if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    job = Scheduler(scheduler)
    job.start_jobs(interval=5)  # Start the scheduler with a 5-second interval

    try:
        # Keep the program running to allow the scheduler to run tasks
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        # Handle the Ctrl+C interruption and stop the scheduler
        print("Scheduler interrupted by user!")
        job.stop_jobs()
