package basic

import (
	"errors"
	"fmt"
	"net/http"
)

type result struct {
	url string
	status string
}

var requestFailed = errors.New("request failed.")

func chanExam() {
	urls := []string{
		"https://www.airbnb.com/",
		"https://www.google.com",
		"https://www.amazon.com/",
		"https://www.reddit.com/",
		"https://www.facebook.com/",
		"https://www.instagram.com/",
	}
 	results := make(map[string]string)
	c := make(chan result)
	for _, url := range urls {
		go hitUrl(url, c)
	}

	for i := 0; i < len(urls); i++ {
		result := <-c
		results[result.url] = result.status
	}
	
	
	for url, status := range results {
		fmt.Println(url, status)
	}
}

func hitUrl(url string, c chan<- result) {
	fmt.Println("Checking, ", url)
	resp, err := http.Get(url)
	if err != nil || resp.StatusCode >= 400 {
		c <- result{url: url, status: "FAILED"}
	} else {
		c <- result{url: url, status: "OK"}
	}
}