package scrapper

import (
	"encoding/csv"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type extractedJob struct {
	id string
	title string
	location string
	salary string
	summary string
}

// Scrape indeed
func Scrape(term string) {
	var baseURL string = "https://kr.indeed.com/jobs?q=" + term + "&limit=50"
	var totalJobs []extractedJob
	extractedJobsCh := make(chan []extractedJob)
	pages := getPages(baseURL)
	for i := 0; i < pages; i++ {
		go getJobsInPage(i, baseURL, extractedJobsCh)
	}
	for i := 0; i< pages; i++ {
		jobs := <- extractedJobsCh
		totalJobs = append(totalJobs, jobs...)
	}

	writeJobsToCsv(totalJobs)
	fmt.Println("Done! ", len(totalJobs))
}

func getJobsInPage(page int, baseURL string, done chan<- []extractedJob) {
	var jobs []extractedJob
	extractedJobCh := make(chan extractedJob)
	pageUrl := baseURL + "&start=" + strconv.Itoa(page * 50)
	fmt.Println("Request " + pageUrl)
	res, err := http.Get(pageUrl)
	checkErr(err)
	checkCode(res)

	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	checkErr(err)

	searchCards := doc.Find(".jobsearch-SerpJobCard")

	searchCards.Each(func(i int, card *goquery.Selection) {
		go extractJob(card, extractedJobCh)
	})

	for i := 0; i < searchCards.Length(); i++ {
		job := <- extractedJobCh
		jobs = append(jobs, job)
	}

	done <- jobs
}

func getPages(baseURL string) int {
	pages := 0
	res, err := http.Get(baseURL)
	checkErr(err)
	checkCode(res)

	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	checkErr(err)

	doc.Find(".pagination").Each(func(i int, s *goquery.Selection) {
		pages = s.Find("a").Length()
	})
	return pages
}

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func checkCode(res *http.Response) {
	if res.StatusCode != 200 {
		log.Fatalln("Request failed with status code : ", res.StatusCode)
	}
}

func CleanString(str string) string {
	return strings.Join(strings.Fields(strings.TrimSpace(str)), " ")
}

func extractJob(card *goquery.Selection, done chan<- extractedJob) {
	id, _ := card.Attr("data-jk")
	title := CleanString(card.Find(".title>a").Text())
	location := CleanString(card.Find(".sjcl").Text())
	salary := CleanString(card.Find(".salaryText").Text())
	summary := CleanString(card.Find(".summary").Text())
	done <- extractedJob{id: id, title: title, location: location, salary: salary, summary: summary}
}

func writeJobsToCsv(jobs []extractedJob) {
	file, err := os.Create("jobs.csv")
	checkErr(err)
	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"ID", "Title", "Location", "Salary", "Summary"}
	wErr := writer.Write(headers)
	checkErr(wErr)

	for _, job := range jobs {
		jobSlice := []string{"https://kr.indeed.com/viewjob?jk=" + job.id, job.title, job.location, job.salary, job.summary}
		jwErr := writer.Write(jobSlice)
		checkErr(jwErr)
	}

}