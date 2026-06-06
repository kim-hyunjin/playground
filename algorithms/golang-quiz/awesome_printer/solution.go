package main

import "fmt"

type doc struct {
	priority int
	location int
}

func solution(priorities []int, location int) int {
	answer := 0
	docs := make([]*doc, 0)
	for i, priority := range priorities {
		docs = append(docs, &doc{
			priority: priority,
			location: i,
		})
	}

	var doc *doc
	for i := len(docs); i > 0; i-- {
		doc, docs = docs[0], docs[1:]
		isPrintable := true
		for _, compareDoc := range docs {
			if (doc.priority < compareDoc.priority) {
				isPrintable = false
				docs = append(docs, doc)
				break
			}
		}
		if (isPrintable) {
			answer++
			if (doc.location == location) {
				break
			}
		}
	}
	return answer
}

func main() {
	priorities := []int{2, 1, 3, 2}
	location := 2
	answer := solution(priorities, location)
	fmt.Println(answer)
}