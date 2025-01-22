import sys
import requests
from bs4 import BeautifulSoup
import json

# Obținem numărul etapei din argumente
if len(sys.argv) < 2:
    print(json.dumps({"error": "Numărul etapei nu a fost specificat."}, ensure_ascii=False))
    exit()

stage_number = sys.argv[1]

# URL-ul paginii de unde vom extrage datele
url = f'https://www.worldfootball.net/schedule/rou-liga-1-2024-2025-spieltag/{stage_number}/'

# Obținem conținutul paginii
response = requests.get(url)
if response.status_code != 200:
    print(json.dumps({"error": "Nu am putut accesa pagina web."}, ensure_ascii=False))
    exit()

# Parsăm conținutul HTML
soup = BeautifulSoup(response.content, 'html.parser')

# Găsim tabela care conține meciurile
match_table = soup.find('table', {'class': 'standard_tabelle'})

if not match_table:
    print(json.dumps({"error": "Nu am putut găsi tabela cu meciuri."}, ensure_ascii=False))
    exit()

# Lista pentru a stoca meciurile
matches = []

# Găsim toate rândurile din tabel (nu mai excludem primul rând)
rows = match_table.find_all('tr')

current_date = ''
for row in rows:
    cols = row.find_all('td')
    # Verificăm dacă rândul conține datele unui meci
    if len(cols) >= 6:
        # Verificăm dacă celula de dată nu este goală
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

        # Eliminăm rezultatul din paranteze
        final_result = result.split('(')[0].strip()

        # Adăugăm meciul în lista de meciuri
        matches.append({
            'date': date,
            'time': time,
            'home_team': home_team,
            'score': score,
            'away_team': away_team,
            'result': final_result
        })

# Afișăm meciurile în format JSON pentru a le prelua din Java
print(json.dumps(matches))
