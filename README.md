
# SlugRush 🏃‍♂️💪

**Real-time gym crowd tracking for UC Santa Cruz students**

[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com)

SlugRush helps UCSC students avoid gym wait times by providing real-time occupancy data and historical crowd patterns. No more 5-15 minute waits outside the fitness center!

## 🎯 Features

- **📊 Real-time Occupancy**: Live gym crowd counts updated every 30 minutes
- **📈 Daily Trends**: Hourly crowd patterns for optimal workout planning  
- **🗓️ Weekly Patterns**: Historical data to identify the best times to visit
- **📱 Mobile Responsive**: Optimized for both desktop and mobile devices
- **⚡ Fast & Reliable**: Built with modern web technologies for optimal performance

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js + TypeScript | React-based web application with SSR |
| **Backend** | FastAPI + Python | RESTful API server with auto-documentation |
| **Database** | PostgreSQL (Supabase) | Time-series crowd data storage |
| **Scheduling** | APScheduler | Automated data collection every 30 minutes |
| **Web Scraping** | BeautifulSoup | Gym occupancy data extraction |
| **Hosting** | Vercel + Render | Optimized deployment platforms |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- PostgreSQL database (or Supabase account)

### 1. Clone the Repository
```bash
git clone https://github.com/Jeeevii/SlugRush.git
cd SlugRush
```

### 2. Backend Setup
```bash
cd slugrush_backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and API keys

# Start the backend
python server.py
```

### 3. Frontend Setup
```bash
cd slugrush_frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Add your backend URL and API key

# Start the frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📡 API Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/` | GET | API information and available routes | Welcome message |
| `/get/count` | GET | Real-time gym occupancy | Live crowd count |
| `/get/daily` | GET | Current day's crowd data | Hourly patterns |
| `/get/weekly` | GET | Weekly aggregated patterns | 7-day trends |

### Example API Response
```json
{
  "id": 123,
  "date": "2025-06-11",
  "day_of_week": "Tuesday",
  "hourly_data": [
    {
      "hour": 14,
      "minute": 30,
      "crowd_count": 85,
      "timestamp": "2025-06-11T14:30:00Z"
    }
  ]
}
```

## 🗄️ Database Schema

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

## 🎨 User Interface

### Daily View
- **Real-time Status**: Current gym occupancy percentage
- **Hourly Trends**: Interactive charts showing crowd levels throughout the day
- **Best Times**: AI-powered recommendations for optimal visit times

### Weekly View  
- **Pattern Analysis**: 7-day crowd patterns with heatmap visualization
- **Day Comparison**: Side-by-side comparison of different days
- **Historical Insights**: Trends and patterns over time

## 🔧 Development

### Project Structure
```
SlugRush/
├── slugrush_frontend/        # Next.js React application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # Reusable UI components  
│   │   └── lib/              # API clients and utilities
├── slugrush_backend/         # FastAPI Python backend
│   ├── server.py             # Main FastAPI application
│   ├── database.py           # PostgreSQL client
│   ├── scheduler.py          # Background job scheduler
│   └── web_scraper.py        # Gym data scraper
└── README.md                 # This file
```

### Data Collection Schedule
- **Weekdays**: Every 30 minutes, 6:00 AM - 11:30 PM
- **Weekends**: Every 30 minutes, 8:00 AM - 8:30 PM  
- **Daily Maintenance**: New day creation at midnight

## 🚀 Deployment

### Production Deployment
1. **Frontend**: Deploy to [Vercel](https://vercel.com) with automatic GitHub integration
2. **Backend**: Deploy to [Render](https://render.com) using the free tier
3. **Database**: Host PostgreSQL on [Supabase](https://supabase.com) free tier

### Environment Variables
```bash
# Backend (.env)
HOST=your_supabase_host
DBNAME=your_database_name  
DBUSER=your_database_user
PASSWORD=your_database_password
PORT=your_database_port
FO_URL=gym_occupancy_url
FO_ID=gym_facility_id
BACKEND_PORT=8000

# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SLUGRUSH_API_KEY=your_api_key
```

## 📈 Performance & Monitoring

- **Data Retention**: Automatic cleanup maintains 4 months of historical data
- **Uptime**: Ping system prevents Render free tier idle timeouts
- **Analytics**: Vercel Analytics for performance monitoring
- **Error Handling**: Comprehensive logging and error recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Team

**Jeevithan Mahenthran** - Project Lead & Full Stack Developer  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://linkedin.com/in/jeevithan-mahenthran)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/jeeevii)

**Hanlin (Kevin) Huang** - Data Scientist  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hanlin-huang-6aa4131ba/)

## 📞 Support

For questions, feedback, or support:
- 📧 Email: [Contact Form](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Jeeevii/SlugRush/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Jeeevii/SlugRush/discussions)

---

**Made with ❤️ for the UCSC community**
