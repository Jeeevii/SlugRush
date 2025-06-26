# SlugRush Backend

SlugRush is a web application designed to track and visualize gym occupancy data. This repository contains the backend implementation, built with **FastAPI**, **PostgreSQL (Supabase)**, and **Render** for hosting.

---

## Features

- **Gym Occupancy Tracking**: Scrapes live gym occupancy data and stores it in a database.
- **Daily and Weekly Data Visualization**: Provides APIs to fetch daily and weekly crowd data for graphing.
- **Automated Data Management**: Automatically deletes the oldest week's data when 4 months of data is reached.
- **Scheduler**: Automates daily and hourly tasks using `APScheduler`.
- **Ping Prevention**: Keeps the backend alive on Render's free tier by sending periodic pings.

---

## Tech Stack

- **Backend Framework**: FastAPI
- **Database**: PostgreSQL (hosted on Supabase)
- **Scheduler**: APScheduler
- **Web Scraping**: BeautifulSoup
- **Hosting**: Render (backend) and Supabase (database)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SlugRush.git
   cd SlugRush
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```env
   HOST=<your_supabase_host>
   DBNAME=<your_database_name>
   DBUSER=<your_database_user>
   PASSWORD=<your_database_password>
   PORT=<your_database_port>
   FO_URL=<gym_occupancy_url>
   FO_ID=<gym_facility_id>
   BACKEND_PORT=8000
   ```

4. Start the backend server:
   ```bash
   python server.py
   ```

---

## API Endpoints

### Root
- **GET** `/`
  - Returns a welcome message and available routes.

### Get Current Count
- **GET** `/get/count`
  - Scrapes live gym occupancy data and returns it as JSON.

### Get Daily Data
- **GET** `/get/daily`
  - Fetches all crowd counts for the current day.

### Get Weekly Data
- **GET** `/get/weekly`
  - Fetches aggregated crowd counts for the past week.

---

## Scheduler Tasks

- **Add New Day**: Adds a new row to the `days_count` table daily at midnight.
- **Add Hourly Count**: Scrapes and stores gym occupancy data every 30 minutes during gym hours.
- **Ping Backend**: Sends a ping to the backend every 5 minutes to prevent idle timeout on Render.

---

## Database Schema

### `days_count`
| Column      | Type       | Description                          |
|-------------|------------|--------------------------------------|
| `id`        | INT        | Primary key (unique day identifier). |
| `date`      | DATE       | Date of the record.                  |
| `status`    | SMALLINT   | 1 = Live, 0 = Old.                   |
| `day_of_week` | VARCHAR(10) | Day of the week (e.g., Monday).     |

### `hourly_count`
| Column       | Type       | Description                          |
|--------------|------------|--------------------------------------|
| `id`         | SERIAL     | Primary key (auto-increment).        |
| `day_id`     | INT        | Foreign key referencing `days_count`.|
| `hour`       | SMALLINT   | Hour of the record (0-23).           |
| `minute`     | SMALLINT   | Minute of the record (0 or 30).      |
| `crowd_count`| SMALLINT   | Number of people in the gym.         |
| `timestamp`  | TIMESTAMP  | Time the data was collected.         |

---

## Deployment

1. **Backend**: Deploy the backend on [Render](https://render.com/).
   - Use the free tier for hosting.
   - Set environment variables in the Render dashboard.

2. **Database**: Host the PostgreSQL database on [Supabase](https://supabase.com/).
   - Use the free tier for up to 4 months of data.

3. **Frontend**: Deploy the React frontend on a platform like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

---

## Future Improvements

- Add user authentication for secure access.
- Implement rate limiting to prevent abuse.
- Optimize database queries for better performance.
- Add unit tests for all backend components.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
