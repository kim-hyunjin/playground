package section14function

import "fmt"

func anonymousFunc() {
	func() {
		fmt.Println("anonymous func ran")
	}()

	func(x int) {
		fmt.Println("anonymous func ran: ", x)
	}(42)
}

