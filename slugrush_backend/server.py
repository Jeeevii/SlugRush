from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from fastapi.responses import JSONResponse
from html_scraper import FOScraper
import json
from datetime import datetime

MOCK_DB_PATH = "mock_database/crowd_week_data.json"

app = FastAPI()

# Updated DB Data Schema
class HourlyData(BaseModel):
    hour: int
    occupancy_count: int
    timestamp: str

class CrowdData(BaseModel):
    id: int
    date: str
    status: str
    day_of_week: str
    hourly_data: List[HourlyData]

# load data from mock DB
def load_mock_data():
    try:
        with open(MOCK_DB_PATH, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

# save data to mock DB
def save_mock_data(data):
    with open(MOCK_DB_PATH, "w") as file:
        json.dump(data, file, indent=4)


# GET endpoint to return parsed scraped data
@app.get("/gym/scrape")
def get_crowd_data():
    scraper = FOScraper()
    try:
        data = scraper.get_hour_count()
        return JSONResponse(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# POST endpoint for scraping and inserting data
@app.post("/gym/scrape/add", response_model=Dict[str, str])
def add_scraped_data():
    scraper = FOScraper()
    try:
        scraped_data = scraper.scrape_html()
        gym_data = load_mock_data()
        today = datetime.now().strftime("%Y-%m-%d")
        day_of_week = datetime.now().strftime("%A")
        
        if today not in gym_data:
            gym_data[today] = {"date": today, "day_of_week": day_of_week, "hourly_data": []}
        
        gym_data[today]["hourly_data"].append(scraped_data)
        save_mock_data(gym_data)
        
        return {"message": "Scraped data added successfully!"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

