import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json

class FOScraper:
    def __init__(self):
        self.url = "https://campusrec.ucsc.edu/FacilityOccupancy"
        self.facility_id = "facility-1799266f-57d9-4cb2-9f43-f5fd88b241db"

    def get_crowd_count(self):
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
    scraper = FOScraper()
    try:
        day_start = scraper.day_start()
        print(f"Full day data: {day_start}")
        parsed_day = json.loads(day_start)

        print(parsed_day['id'])
        print(parsed_day['date'])
        print(parsed_day['status'])
        print(parsed_day['day_of_week'])

        # hour testing
        crowd_data = scraper.get_crowd_count()
        print("Hourly data: ", crowd_data)
        parsed_crowd = json.loads(crowd_data)
        print(parsed_crowd['hour'])
        print(parsed_crowd['crowd_count'])
        print(parsed_crowd['timestamp'])
        
    except Exception as e:
        print(f"Error: {e}")



