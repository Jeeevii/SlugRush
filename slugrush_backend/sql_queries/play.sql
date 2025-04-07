-- adding items into days_count
insert into days_count (id, date, status, day_of_week )
values (7, '2025-4-6', 1, 'Sunday')

-- checking whats in days_count
select * from days_count

-- adding items to hourly_count
insert into hourly_count (day_id, hour, minute, crowd_count, timestamp )
values (7, 16, 30, 100, '2025-04-06 16:22:00')

-- checking whats in hourly_count
select * from hourly_count hc 

-- checking everything 
select * from days_count dc join hourly_count hc on dc.id = hc.day_id

-- alter table hourly_count rename column occupancy_count to crowd_count
-- DELETE FROM hourly_count WHERE id = 5;
