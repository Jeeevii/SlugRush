import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json

class FOScraper:
    def __init__(self):
        self.url = "https://campusrec.ucsc.edu/FacilityOccupancy"
        self.facility_id = "facility-1799266f-57d9-4cb2-9f43-f5fd88b241db"
    
    def get_day_start(self):
        # Get the current date and day of the week
        current_datetime = datetime.now()
        date = current_datetime.strftime("%Y-%m-%d")
        
        date_dict = {"Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6} 
        day_of_week = current_datetime.strftime("%A")
        id = f"{date_dict[day_of_week]}"

        # Return the base data structure with empty hourly data
        return {
            "id": id,
            "date": date,
            "status": "live", # swap to INT -> 1 for Live, 0 for Old 
            "day_of_week": day_of_week,
            "hourly_data": []  # Empty list for now, will be filled later
        }

    def get_hour_count(self):
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
        timestamp = current_datetime.strftime("%Y-%m-%dT%H:%M:%S") # timestamp
        # res = {}
        # res['hour'] = current_datetime.hour
        # res['occupancy_count'] = int(occupancy_count)
        # res['timestamp'] = timestamp

        return json.dumps({
            'hour': current_datetime.hour,
            'occupancy_count': int(occupancy_count),
            'timestamp': timestamp
        })

# internal testing 
if __name__ == "__main__":
    scraper = FOScraper()
    try:
        full_day_data = scraper.get_day_start()
        print(f"Full day data: {full_day_data}")

        data = scraper.get_hour_count()
        #print("Hourly data: ", data)
        parsed_data = json.loads(data)
        print(parsed_data['hour'])
        print(parsed_data['occupancy_count'])
        
    except Exception as e:
        print(f"Error: {e}")



