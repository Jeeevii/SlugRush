# SlugRush Gym Tracker

This is a simple web app for UCSC students to track gym crowd levels. It features a frontend built with Next.js, a backend running on Node.js, and a mock database for testing purposes.

## Project Structure

- **slugrush_frontend/**: React/Next.js app
- **slugrush_backend/**: FastAPI (with PostgreSQL DB running on Docker & mock DB)
- **slugrush_backend/docker-compose.yml**: Install Docker and follow backend instructions to set up SQL DB
- **slugrush_backend/mockdb**: A mock database used for inital testing, runs when fastapi app starts

## Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/Jeeevii/SlugRush.git
code slugrush
```
## 2. Full-Stack Set Up 

Each folder provide's an specfic README which provides a step by step for setting up the entire project, please refer to them before running the entire app locally.

## 3. Running the Entire App Locally

1. Make sure the **frontend** is running on `http://localhost:3000` and the **backend** is running on `http://localhost:8000`.

2. Navigate to `http://localhost:3000` in your browser to access the app.

---
## Additional Information

- **Frontend URL:** `http://localhost:3000`
- **Backend URL:** `http://localhost:8000`
- **Mock DB Endpoint:** `http://localhost:8000/get/daily` or `http://localhost:8000/get/weekly`

---
