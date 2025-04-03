import random
import csv
from datetime import datetime, timedelta

# Define constraints
num_records = 200  # Adjust as needed
member_id_range = (1, 403)
amount_options = [50.00, 100.00, 300.00]
date_start = datetime(2024, 1, 1)
date_end = datetime(2025, 12, 31)

def random_date(start, end):
    delta = end - start
    random_days = random.randint(0, delta.days)
    return (start + timedelta(days=random_days)).strftime('%m/%d/%Y')

# Generate data
data = [
    [random.randint(*member_id_range), random.choice(amount_options), random_date(date_start, date_end)]
    for _ in range(num_records)
]

# Write to CSV
csv_filename = "payments.csv"
with open(csv_filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["memberID", "amount", "paymentDate"])
    writer.writerows(data)

print(f"CSV file '{csv_filename}' generated successfully.")
