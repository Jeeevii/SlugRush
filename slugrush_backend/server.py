from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2
import json

from web_scraper import Scraper
from scheduler import Scheduler

# MOCK_DB_PATH = "mock_database/crowd_week_data.json"

class Crowd(BaseModel):
    crowd_count: int

app = FastAPI()
scheduler = Scheduler() # runs background scheduler seperate thread

# runs when backend server is started 
@app.on_event("startup")  
async def startup_event():
    scheduler.start_jobs()

# runs when backend server shuts down (manual ctrl + c)
@app.on_event("shutdown") 
async def shutdown_event():
    scheduler.stop_jobs()

# route 
@app.get("/")
async def root():
    return {
        "message": "SlugRush | Backend running on FastAPI on PORT 8000",
        "routes": {
            "/docs": "FastAPI's docs with clear and visual examples",
            "/get/count": "GETS formatted count of Fitness Center",
            "/get/daily": "GETS all daily counts currently getting collected",
            "/get/weekly": "GETS previous week's counts",
        }
    }


# GET endpoint - scrapes gym page when called and returns jsonified dict
@app.get("/get/count")
def get_count() -> None:
    scraper = Scraper()
    try:
        data = scraper.gym_scrape()
        return json.loads(data)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
    
# GET endpoint - queries database and returns all rows with current day crowd_counts - NEEDED FOR GRAPHING DAILY VIEW
@app.get("/get/daily")
def get_daily() -> None:

    return JSONResponse(content={
        "status": "success",
        "message": "GET daily route currently under development",
        "data": []
    })

# GET endpoint - queries database and returns all of previous weeks (1-7) crowd_count - NEEDED FOR GRAPHING WEEKLY VIEW
@app.get("/get/weekly")
def get_weekly() -> JSONResponse:

    return JSONResponse(content={
        "status": "success",
        "message": "GET weekly route currently under development",
        "data": []
    })



# internal testing - CAN NOT FOR FAST API, need httpx 
# if __name__ == "__main__":
#     #app.run(debug=True)

