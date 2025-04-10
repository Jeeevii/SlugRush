-- adding items into days_count
INSERT INTO days_count (id, date, status, day_of_week )
VALUES (7, '2025-4-6', 1, 'Sunday')

-- checking whats in days_count
SELECT * FROM days_count

-- adding items to hourly_count
INSERT INTO hourly_count (day_id, hour, minute, crowd_count, timestamp )
VALUES (7, 16, 30, 100, '2025-04-06 16:22:00')

-- checking whats in hourly_count
SELECT * FROM hourly_count hc 

-- checking everything 
SELECT * FROM days_count dc JOIN hourly_count hc ON dc.id = hc.day_id

-- alter table hourly_count rename column occupancy_count to crowd_count
-- DELETE FROM hourly_count WHERE id = 5;
DELETE FROM hourly_count WHERE id = 5;

--- updates status value based on id
UPDATE days_count SET status = 1 WHERE id = 2

