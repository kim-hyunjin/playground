package section14function

import "fmt"

var x int

// code block enclosing some variable
func closureExam() {
	fmt.Println(x) // 0
	x++
	fmt.Println(x) // 1
	bar()
	fmt.Println(x) // 2

	{
		y := 42
		fmt.Println(y)
	}
	// fmt.Println(y) // undefiend

	inc := incrementor()
	inc2 := incrementor()
	num := inc()
	fmt.Println(num) // 1
	num = inc()
	fmt.Println(num) // 2

	num2 := inc2()
	fmt.Println(num2) // 1
	num2 = inc2()
	fmt.Println(num2) // 2
}

func bar() {
	fmt.Println("hello")
	x++
}

func incrementor() func() int {
	var x int // 0
	return func() int {
		x++
		return x
	}
}