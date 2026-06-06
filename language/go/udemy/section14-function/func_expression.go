package section14function

import "fmt"

// FuncExpression 함수를 변수처럼
func FuncExpression() {
	f := func() {
		fmt.Println("my first func expression")
	}

	f()

	f2 := func(x int) {
		fmt.Println("the year big brother started watching: ", x)
	}

	f2(1984)
}