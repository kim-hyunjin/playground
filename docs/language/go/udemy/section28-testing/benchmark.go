package section28testing

import (
	"fmt"
	"strings"
)

func benchmarkExam1() {
	fmt.Println(Greet("James"))
}

// Greet say hello to
func Greet(to string) string {
	return "Hello, " + to
}

// Cat concat string
func Cat(xs []string) string {
	s := xs[0]
	for _, v := range xs[1:] {
		s += " "
		s += v
	}
	return s
}

func Join(xs []string) string {
	return strings.Join(xs, " ")
}