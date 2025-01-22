import sys
import requests
from bs4 import BeautifulSoup
import json

if len(sys.argv) < 2:
    print(json.dumps({"error": "Numarul etapei nu a fost specificat."}, ensure_ascii=False))
    exit()

stage_number = sys.argv[1]

url = f'https://www.worldfootball.net/schedule/rou-liga-1-2024-2025-spieltag/{stage_number}/'

response = requests.get(url)
if response.status_code != 200:
    print(json.dumps({"error": "Nu am putut accesa pagina web."}, ensure_ascii=False))
    exit()

soup = BeautifulSoup(response.content, 'html.parser')

match_table = soup.find('table', {'class': 'standard_tabelle'})

if not match_table:
    print(json.dumps({"error": "Nu s-a gasit tabela cu meciuri."}, ensure_ascii=False))
    exit()

matches = []

rows = match_table.find_all('tr')

current_date = ''
for row in rows:
    cols = row.find_all('td')
    if len(cols) >= 6:
        date_cell = cols[0].get_text(strip=True)
        if date_cell:
            current_date = date_cell
        date = current_date
        time = cols[1].get_text(strip=True)
        home_team = cols[2].get_text(strip=True)
        score = cols[3].get_text(strip=True)
        away_team = cols[4].get_text(strip=True)
        result_link = cols[5].find('a')
        if result_link:
            result = result_link.get_text(strip=True)
        else:
            result = cols[5].get_text(strip=True)

        final_result = result.split('(')[0].strip()

        matches.append({
            'date': date,
            'time': time,
            'home_team': home_team,
            'score': score,
            'away_team': away_team,
            'result': final_result
        })

print(json.dumps(matches))
