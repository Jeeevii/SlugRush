from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2
import json

from html_scraper import FOScraper
from scheduler import Scheduler

# MOCK_DB_PATH = "mock_database/crowd_week_data.json"

class Crowd(BaseModel):
    crowd_count: int

app = FastAPI()
scheduler = Scheduler() # runs background scheduler seperate thread


@app.on_event("startup") # when backend server runs 
async def startup_event():
    scheduler.start_jobs()

@app.on_event("shutdown") # when server stops (manual ctrl + c)
async def shutdown_event():
    scheduler.stop_jobs()


@app.get("/")
async def root():
    return {
        "message": "SlugRush | Backend running on FastAPI on PORT 8000",
        "routes": {
            "/docs": "FastAPI's docs with clear and visual examples",
            "/get/count": "GETS formatted count of Fitness Center",
            "/get/daily": "GETS all daily counts currently getting collected",
            "/get/weekly": "GETS previous week's counts",
            "/post/crowd": "POSTS given count into daily table"
        }
    }


# GET endpoint to return scraped count data
@app.get("/get/count")
def get_count():
    scraper = FOScraper()
    try:
        data = scraper.get_crowd_count()
        return json.loads(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    
# GET endpoint to return day table containing all live data
@app.get("/get/daily")
def get_daily():

    return JSONResponse(content={
        "status": "success",
        "message": "GET daily route currently under development",
        "data": []
    })


@app.get("/get/weekly")
def get_weekly():

    return JSONResponse(content={
        "status": "success",
        "message": "GET weekly route currently under development",
        "data": []
    })


@app.post("/post/crowd/")
def post_crowd(crowd: Crowd):
    count = crowd.crowd_count

    return {
        "status": "success",
        "message": "POST crowd count currently under development",
        "crowd": count
    }


# internal testing - CAN NOT FOR FAST API, need httpx 
# if __name__ == "__main__":
#     #app.run(debug=True)

