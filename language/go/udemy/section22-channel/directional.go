package section22channel

import "fmt"

func directionalExam() {
	c := make(<-chan int, 2) // receive only
	// c <- 42 // error
	// c <- 43

	fmt.Println(<-c)
	fmt.Println(<-c)
	fmt.Printf("%T\n", c)
}

func directionalExam2() {
	c := make(chan int)
	cr := make(<-chan int) // receive
	cs := make(chan<- int) // send

	fmt.Printf("%T\n", c)  // chan int
	fmt.Printf("%T\n", cr) // <-chan int
	fmt.Printf("%T\n", cs) // chan<- int
}
