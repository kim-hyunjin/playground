import requests
from bs4 import BeautifulSoup

URL = f"https://stackoverflow.com/jobs?q=python&sort=i"

def get_last_page():
  result = requests.get(URL)
  soup = BeautifulSoup(result.text, "html.parser")
  pages = soup.find("div", {"class": "s-pagination"}).find_all("a")
  last_page = pages[-2].get_text(strip=True)
  return int(last_page)
  
def extract_jobinfo(html):
  title = html.find("div", {"class": "-title"}).find("h2").find("a")["title"]
  company, location = html.find("div", {"class": "-company"}).find_all("span", recursive=False)   #첫번째 변수가 리스트의 첫번째, 두번째 변수가 리스트의 두번째를 가리킴.
                                                                                                  #recursive=False 옵션을 주면 span 안에 있는 span은 찾이 않음.
  company = company.get_text(strip=True)
  location = location.get_text(strip=True).strip("-").lstrip().rstrip()
  job_id = html["data-jobid"]
  return {
    "title": title, 
    "company": company, 
    "location": location,
    "apply_link": f"https://stackoverflow.com/jobs/{job_id}"
  }

def extract_jobs(last_page):
  jobs = []
  for page in range(last_page):    #range는 인자로 integer를 사용.
    print(f"Scraping Stackoverflow page: {page}")
    pg = requests.get(f"{URL}&pg={page+1}")
    soup = BeautifulSoup(pg.text, "html.parser")
    results = soup.find_all("div", {"class": "-job"})
    for result in results:
      job = extract_jobinfo(result)
      jobs.append(job)
  return jobs


def get_jobs():
  last_page = get_last_page()
  jobs = extract_jobs(last_page)
  return jobs