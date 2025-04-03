import csv
import random

# Use only the class names you provided
class_names = [
    "Yoga", "Pilates", "Spin", "CrossFit", "HIIT", "Zumba", "Boxing", "Strength Training",
    "Cardio Blast", "Bootcamp", "Aqua Aerobics", "Stretch & Relax", "Dance Fitness", "Cycling",
    "Functional Training", "TRX", "Kickboxing", "Core Strength", "Mobility", "Barre"
]

# Generate 400 rows
data = []
for _ in range(400):
    class_name = random.choice(class_names)
    instructor_id = random.randint(1, 403)
    time = f"{random.randint(6, 22)}:{random.choice([0, 15, 30, 45])}"  # Random hour and minutes

    data.append([class_name, instructor_id, time])

# Write to CSV
with open("classes.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["ClassName", "InstructorID", "Time"])
    writer.writerows(data)

print("CSV file 'gym_classes.csv' created.")
