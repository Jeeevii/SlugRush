import requests
import json
import os

from bs4 import BeautifulSoup
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class Scraper:
    def __init__(self) -> None:
        self.url = os.environ.get("FO_URL")
        self.facility_id = os.environ.get("FO_ID")

    def gym_scrape(self) -> json:
        response = requests.get(self.url)
        if response.status_code != 200:
            raise Exception("Failed to retrieve data")

        # parse html content with soup import
        soup = BeautifulSoup(response.text, 'html.parser')
        # parse by specfic facility ID, theres like 15 (1 per facility)
        facility = soup.find("div", id=self.facility_id)
        if not facility:
            raise Exception("Facility not found")

        # extract static occupancy count for East Gym
        occupancy_count = facility.find("p", class_="occupancy-count").strong.text.strip()
        current_datetime = datetime.now() # current date
        timestamp = current_datetime.strftime("%Y-%m-%d %H:%M:%S") # timestamp
        # res = {}
        # res['hour'] = current_datetime.hour
        # res['occupancy_count'] = int(occupancy_count)
        # res['timestamp'] = timestamp

        return json.dumps({
            'hour': current_datetime.hour,
            'minute': current_datetime.minute,
            'crowd_count': int(occupancy_count),
            'timestamp': timestamp
        })

# internal testing 
if __name__ == "__main__":
    scraper = Scraper()
    try:
        # hour testing
        crowd_data = scraper.gym_scrape()
        print("Hourly data: ", crowd_data)
        parsed_crowd = json.loads(crowd_data)
        print(parsed_crowd['hour'])
        print(parsed_crowd['crowd_count'])
        print(parsed_crowd['timestamp'])
        
    except Exception as e:
        print(f"Error: {e}")



