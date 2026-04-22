package section22channel

import "fmt"

func usage() {
	c := make(chan int)

	go sender(c)

	receiver(c)

	fmt.Println("about to exit")
}

func sender(c chan<- int) {
	c <- 42
}

func receiver(c <-chan int) {
	fmt.Println(<-c)
}
