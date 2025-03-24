## Backend Setup (Node.js)

The backend is built with **Node.js** and handles the API.

1. Navigate to the backend folder:

    ```bash
    cd ../backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `backend` folder.
    - Add the following environment variable for local development (adjust the database URL if necessary):

      ```
      DATABASE_URL=mongodb://localhost:27017/slugrush
      ```

4. Run the backend locally:

    ```bash
    npm run dev
    ```

    This will start the backend server on `http://localhost:5000`.

---

## 4. Mock Database

For now, we are using a simple mock database.

- URL for Mock DB: `http://localhost:5000/api/db`
- This endpoint simulates basic data storage and retrieval.
- The backend will mock interaction with the database, and you can view the data on the frontend.

---