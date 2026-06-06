import requests
from bs4 import BeautifulSoup

LIMIT = 50
URL = f"https://kr.indeed.com/jobs?q=python&limit={LIMIT}"


def extract_last_page():
    result = requests.get(URL)
    soup = BeautifulSoup(result.text, "html.parser")
    pagination = soup.find("div", {"class": "pagination"})
    links = pagination.find_all('a')
    pages = []
    for i in links[0:-1]:
        pages.append(int(i.find("span").string))
    max_page = pages[-1]
    return max_page


def extract_jobinfo(html):
    title = html.find("div", {"class": "title"}).find("a")["title"]
    company = html.find("span", {"class": "company"})
    if company is not None:
        company_anchor = company.find("a")
        if company_anchor is not None:
            company = str(company_anchor.string)
        else:
            company = str(company.string)
    else:
        company = "None"
    company = company.strip("\n")
    location = html.find("div", {"class": "recJobLoc"})["data-rc-loc"]
    job_id = html["data-jk"]
    return {'title': title, 'company': company, 'location': location,
            'link': f"https://kr.indeed.com/viewjob?&jk={job_id}"}


def extract_jobs(last_page):
    jobs = []
    for page in range(last_page):
        print(f"Scraping Indeed page: {page}")
        start = requests.get(f"{URL}&start={page*LIMIT}")
        soup = BeautifulSoup(start.text, "html.parser")
        results = soup.find_all("div", {"class": "jobsearch-SerpJobCard"})
        for i in results:
            jobinfo = extract_jobinfo(i)
            jobs.append(jobinfo)
    return jobs

def get_jobs():
    last_page = extract_last_page()
    jobs = extract_jobs(last_page)
    return jobs