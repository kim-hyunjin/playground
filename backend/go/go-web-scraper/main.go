package main

import (
	"os"
	"strings"

	"github.com/kim-hyunjin/go-scraper/scrapper"
	"github.com/labstack/echo"
)

const fileName = "jobs.csv"

func handleHome(c echo.Context) error {
	return c.File("index.html")
}

func handleScrape(c echo.Context) error {
	defer os.Remove(fileName)
	term := strings.ToLower(scrapper.CleanString(c.FormValue("term")))
	scrapper.Scrape(term)
	return c.Attachment(fileName, "job.csv")
}

func main() {
	e := echo.New()
	e.GET("/", handleHome)
	e.POST("/scrape", handleScrape)
	e.Logger.Fatal(e.Start(":80"))
	scrapper.Scrape("term")
}