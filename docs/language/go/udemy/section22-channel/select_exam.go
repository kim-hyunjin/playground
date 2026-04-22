package section22channel

import "fmt"

func selectExam() {
	even := make(chan int)
	odd := make(chan int)
	quit := make(chan int)

	go sendNumbers(even, odd, quit)
	receiveNumbers(even, odd, quit)

	fmt.Println("about to exit")
}

func sendNumbers(e, o, q chan<- int) {
	for i := 0; i < 100; i++ {
		if i%2 == 0 {
			e <- i
		} else {
			o <- i
		}
	}

	q <- 0
}

func receiveNumbers(e, o, q <-chan int) {
	for {
		select {
		case v := <-e:
			fmt.Println("from the even channel: ", v)
		case v := <-o:
			fmt.Println("from the odd channel: ", v)
		case v := <-q:
			fmt.Println("from the quit channel: ", v)
			return
		}
	}
}
