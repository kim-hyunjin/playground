package section22channel

import "fmt"

func commaOkIdiomExam() {
	c := make(chan int)
	go func() {
		c <- 42
		close(c)
	}()

	v, ok := <-c
	fmt.Println(v, ok) // 42 true

	v, ok = <-c
	fmt.Println(v, ok) // 0 false

}

func commaOkIdiomExam2() {
	even := make(chan int)
	odd := make(chan int)
	quitBool := make(chan bool)
	quitInt := make(chan int)

	go sendNumbers2(even, odd, quitBool)
	receiveNumbers2(even, odd, quitBool)

	go sendNumbers3(even, odd, quitInt)
	receiveNumbers3(even, odd, quitInt)

	fmt.Println("about to exit")
}

// with bool
func sendNumbers2(e, o chan<- int, q chan<- bool) {
	for i := 0; i < 10; i++ {
		if i%2 == 0 {
			e <- i
		} else {
			o <- i
		}
	}

	close(q)
}

// with bool
func receiveNumbers2(e, o <-chan int, q <-chan bool) {
	for {
		select {
		case v := <-e:
			fmt.Println("from the even channel: ", v)
		case v := <-o:
			fmt.Println("from the odd channel: ", v)
		case i, ok := <-q:
			if !ok {
				fmt.Println("from comma ok", i, ok) // false, false
				return
			}
			fmt.Println("from comma ok", i)
		}
	}
}

func sendNumbers3(e, o, q chan<- int) {
	for i := 0; i < 10; i++ {
		if i%2 == 0 {
			e <- i
		} else {
			o <- i
		}
	}

	close(q)
}

func receiveNumbers3(e, o, q <-chan int) {
	for {
		select {
		case v := <-e:
			fmt.Println("from the even channel: ", v)
		case v := <-o:
			fmt.Println("from the odd channel: ", v)
		case i, ok := <-q:
			if !ok {
				fmt.Println("from comma ok", i, ok) // 0, false
				return
			}
			fmt.Println("from comma ok", i)
		}
	}
}
