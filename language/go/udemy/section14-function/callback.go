package section14function

import "fmt"

// CallbackExam show how callback works
func CallbackExam() {

	ii := []int{1, 2, 3, 4, 5, 6, 7, 8, 10}
	s := sum(ii...)
	fmt.Println(s)

	s2 := even(sum, ii...)
	fmt.Println("even numbers ", s2)

	s3 := odd(sum, ii...)
	fmt.Println("odd numbers ", s3)
}

func sum(xi ...int) int {
	total := 0
	for _, v := range xi {
		total += v
	}
	return total
}

func even(f func(xi ...int) int, vi ...int) int {
	var evenNums []int
	for _, v := range vi {
		if v % 2 == 0 {
			evenNums = append(evenNums, v)
		}
	}
	return f(evenNums...)
}

func odd(f func(xi ...int) int, vi ...int) int {
	var oddNums []int
	for _, v := range vi {
		if v % 2 == 1 {
			oddNums = append(oddNums, v)
		}
	}
	return f(oddNums...)
}