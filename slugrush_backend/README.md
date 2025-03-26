## Backend Setup (FastAPI + Python)

The backend is built with **FastAPI** and handles the API using a mock database.

### 1. Set Up Python Environment (Windows)

1. **Create a Virtual Environment:**

    Open your terminal or PowerShell and navigate to the **backend** folder:

    ```bash
    cd ../backend
    ```

    Create a virtual environment:

    ```bash
    python -m venv .venv
    ```

2. **Activate the Virtual Environment:**
    - For Command Prompt:

        ```bash
        .venv\Scripts\activate
        ```

3. **Install Required Dependencies:**

    Install the necessary Python modules, including **FastAPI** and **Uvicorn**, by running:

    ```bash
    pip install fastapi uvicorn
    ```

### 2. Mock Database

For now, we are using a simple mock database stored in `mock_databse/crowd_data.json`.

- **URL for Mock DB:** `http://localhost:8000/gym/crowd`
- This endpoint serves mock data from the `crowd_data.json` file.

### 3. Run the Backend Locally

1. **Start the FastAPI Server:**

    To start the FastAPI server with the mock database, use the following command:

    ```bash
    python -m uvicorn server:app --reload
    ```

    The server will be available at `http://localhost:8000`. You can access the mock database at `http://localhost:8000/gym/crowd`.

    This will allow you to interact with the mock database using the FastAPI server.
