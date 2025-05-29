import requests
import csv
import os
from datetime import datetime

API_URL = 'https://realtime-weather-api-1.onrender.com/data'
CSV_FILE = 'history.csv'

def fetch_data():
    r = requests.get(API_URL)
    data = r.json()
    return {
        'time': data.get('localTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
        'temperature': data.get('temperature'),
        'humidity': data.get('humidity'),
        'uSv': data.get('uSv'),
        'counts': data.get('counts'),
        'cps': data.get('cps'),
        'station': data.get('stationName'),
    }

def append_csv(row):
    is_new = not os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if is_new:
            writer.writeheader()
        writer.writerow(row)

if __name__ == '__main__':
    data = fetch_data()
    append_csv(data)
