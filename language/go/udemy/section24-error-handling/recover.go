package section24errorhandling

import "fmt"

func recoverExam() {
	recoverFn()
}

func recoverFn() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in f", r)
		}
	}()
	panicFn(0)
	fmt.Println("Returned normally from panicFn")
}

func panicFn(i int) {
	if i > 3 {
		fmt.Println("Panicking!")
		panic(fmt.Sprintf("%v", i)) // panic 호출 시 콜스택을 거슬러올라가며 defer함수들을 호출
	}
	defer fmt.Println("Defer in g", i)
	fmt.Println("Printing in g", i)
	panicFn(i + 1)
}