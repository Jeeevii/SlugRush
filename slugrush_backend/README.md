## 🛠️ Backend Setup (FastAPI + PostgreSQL via Docker)

The backend is built with **FastAPI** and now runs with a real PostgreSQL database using Docker.

---

### 1. 🐍 Set Up Python Environment (Windows) - IF NEEDED/MANAGING MUTIPLE PROJECTS

1. **Create a Virtual Environment**

   Navigate to the `backend` folder:

   ```bash
   cd ../backend
   python -m venv .venv
   ```

2. **Activate the Virtual Environment**

   - For **Command Prompt**:

     ```bash
     .venv\Scripts\activate
     ```

3. **Install Dependencies**

   ```bash
   pip install fastapi uvicorn psycopg2
   ```

   > 💡 `psycopg2` is the PostgreSQL adapter for Python.

---

### 2. 🐘 PostgreSQL Database (via Docker)

We're using Docker to spin up a local PostgreSQL instance for development and testing. Here’s the setup:

#### 🚀 Start the Database

Launch the database container:

```bash
docker-compose up -d
```

Check if it’s running:

```bash
docker ps
```

You should see a `slugrush` container running on port **5432**.

---

### 3. 🔌 Connect to the Database

#### 🖥️ GUI Access (DBeaver)

Use the following credentials:

- **Host**: `localhost`
- **Port**: `5432`
- **User**: `homies`
- **Password**: `banana`
- **Database**: `crowd_data`

---

#### CLI Access

To enter the psql shell:

```bash
docker exec -it slugrush psql -U homies -d crowd_data
```

### 4. 🚀 Run the Backend Locally

Start the FastAPI server:

```bash
python -m uvicorn server:app --reload
```

- **Base URL**: [http://localhost:8000](http://localhost:8000)
- **Sample Endpoint**: [http://localhost:8000/gym/crowd](http://localhost:8000/gym/crowd)

---

### 5. 🐳 Useful Docker Commands

- 🔄 Restart DB container:

  ```bash
  docker-compose restart
  ```

- 📋 See logs:

  ```bash
  docker logs slugrush
  ```

- 🛑 Stop all containers:

  ```bash
  docker-compose down
  ```

- 💣 Remove volumes (reset the DB):

  ```bash
  docker-compose down -v
  ```

---

### 6. 📦 Legacy Mock DB (Optional)

Still available for quick testing:

- File: `mock_database/crowd_data.json`
- Endpoint: [http://localhost:8000/gym/crowd](http://localhost:8000/gym/crowd)
```

Let me know if you want this styled with emojis, badges, or split up by environments (like dev vs prod). Happy to help you glow this up even more ✨