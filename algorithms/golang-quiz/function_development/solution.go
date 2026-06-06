package main

import (
	"math"
	"fmt"
)

func main() {
	progresses := []int{93, 30, 55}
	speeds := []int{1, 30, 5}
	answer := solution(progresses, speeds)
	fmt.Println(answer)
}

func solution(progresses []int, speeds []int) []int{
	answer := make([]int, 1)
	leftDays := make([]int, 0)
	for i, progress := range progresses {
		leftDays = append(leftDays, int(math.Ceil(float64((100 - progress)) / float64(speeds[i]))))
	}
	fmt.Println(leftDays)

	releaseDay := leftDays[0]

	j := 0
	for i := 0; i < len(leftDays); i++ {
		if (leftDays[i] <= releaseDay) {
			answer[j] += 1;
		} else {
			releaseDay = leftDays[i]
			answer = append(answer, 1)
			j++
		}
	}

	return answer
}