import requests
from bs4 import BeautifulSoup
from datetime import datetime

class FOScraper:
    def __init__(self):
        self.url = "https://campusrec.ucsc.edu/FacilityOccupancy"
        self.facility_id = "facility-bd6cf7a0-9924-4821-84d7-5a995cc63081"
    
    def scrape_html(self):
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
        
        # SQL Table Schema - manually incrimate for ID? 
        return {
            "id": current_datetime.timestamp(),  # CHANGE TO MATCH DATE - even need unique ID? 
            "day_of_week": current_datetime.strftime("%A"),
            "hour": current_datetime.hour,
            "occupancy_count": int(occupancy_count),
            "timestamp": timestamp
        }

# internal testing 
if __name__ == "__main__":
    scraper = FOScraper()
    try:
        data = scraper.scrape_html()
        print(data)
    except Exception as e:
        print(f"Error: {e}")
