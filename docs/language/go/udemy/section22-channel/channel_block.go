package section22channel

import "fmt"

// not work
func blockedExam() {
	c := make(chan int)

	c <- 42 // blocked here

	fmt.Println(<-c)
}

// work
func blockedExam2() {
	c := make(chan int)

	go func() {
		c <- 42
	}()

	fmt.Println(<-c)
}

// buffer channel
func blockedExam3() {
	c := make(chan int, 2)
	c <- 42
	c <- 43

	fmt.Println(<-c) // 42
	fmt.Println(<-c) // 43
}
