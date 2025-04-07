-- daily table which provides key for hourly count, also status check
CREATE TABLE IF NOT EXISTS days_count (
    id INT PRIMARY KEY,  -- 1–14 rotation
    date DATE NOT NULL,
    status SMALLINT NOT NULL CHECK (status IN (0, 1)),  -- 0 = Old, 1 = Live
    day_of_week VARCHAR(10) NOT NULL
);

-- unique count per 30 minutes, referenced by days_count tables
CREATE TABLE IF NOT EXISTS hourly_count (
    id SERIAL PRIMARY KEY,  -- auto-increment
    day_id INT NOT NULL REFERENCES days_count(id),
    hour SMALLINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
    minute SMALLINT NOT NULL CHECK (minute IN (0, 30)),
    crowd_count SMALLINT NOT NULL,
    timestamp TIMESTAMP NOT NULL
);