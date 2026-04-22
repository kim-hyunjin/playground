package section22channel

import "fmt"

func rangeExam() {
	c := make(chan int)

	go func(c chan<- int) {
		for i := 0; i < 100; i++ {
			c <- i
		}
		close(c) // close channel only bidirectional or send-only
	}(c)

	// receive until channel closed
	for v := range c {
		fmt.Println(v)
	}

	fmt.Println("exit")

}
