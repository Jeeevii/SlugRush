import json
from datetime import datetime, timedelta
import random

# Define operating hours for each day
gym_hours = {
    "Monday": (6, 23), "Tuesday": (6, 23), "Wednesday": (6, 23), "Thursday": (6, 23),
    "Friday": (6, 23), "Saturday": (8, 20), "Sunday": (8, 20)
}

# Mapping day names to their IDs (Week 1: 1-7, Week 2: 8-14)
day_to_id = {day: i+1 for i, day in enumerate(gym_hours.keys())}

# Function to generate realistic occupancy counts
def generate_occupancy(hour, minute):
    if 6 <= hour < 9:
        return random.randint(20, 50)  # Morning moderate traffic
    elif 9 <= hour < 12:
        return random.randint(30, 70)  # Mid-morning peak
    elif 12 <= hour < 14:
        return random.randint(50, 90)  # Lunchtime rush
    elif 14 <= hour < 17:
        return random.randint(30, 70)  # Afternoon dip
    elif 17 <= hour < 20:
        return random.randint(60, 100)  # Evening peak
    elif 20 <= hour < 23:
        return random.randint(20, 60)  # Late-night decline
    return 0

# Generate data for two weeks
start_date = datetime(2025, 3, 11)  # Adjust this to start from a desired date
data = []

for day_offset in range(0, 14):
    current_date = start_date + timedelta(days=day_offset)
    day_name = current_date.strftime("%A")
    day_id = day_to_id[day_name] + (7 if day_offset >= 7 else 0)  # Week 2 offset
    status = "1" if day_offset == 13 else "0"  # Last day is live, others are past
    
    hourly_crowd = []
    open_hour, close_hour = gym_hours[day_name]
    for hour in range(open_hour, close_hour):
        for minute in [0, 30]:
            timestamp = current_date.replace(hour=hour, minute=minute, second=0).strftime("%Y-%m-%dT%H:%M:%S")
            occupancy = generate_occupancy(hour, minute)
            hourly_crowd.append({
                "hour": hour,
                "minute": minute,
                "occupancy_count": occupancy,
                "timestamp": timestamp
            })
    
    data.append({
        "id": str(day_id),
        "date": current_date.strftime("%Y-%m-%d"),
        "status": status,
        "day_of_week": day_name,
        "hourly_crowd": hourly_crowd
    })

# Save to JSON file
with open("gym_occupancy_data.json", "w") as file:
    json.dump(data, file, indent=4)

print("Gym occupancy data generated successfully!")
