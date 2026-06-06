package section22channel

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

func fanInExam() {
	even := make(chan int)
	odd := make(chan int)
	fanin := make(chan int)

	// send
	go func(e, o chan<- int) {
		for i := 0; i < 100; i++ {
			if i%2 == 0 {
				e <- i
			} else {
				o <- i
			}
		}
		close(even)
		close(odd)
	}(even, odd)

	// receive and send to fanin
	go func(e, o <-chan int, fanin chan<- int) {
		var wg sync.WaitGroup
		wg.Add(2)

		go func() {
			for v := range even {
				fanin <- v
			}
			wg.Done()
		}()

		go func() {
			for v := range odd {
				fanin <- v
			}
			wg.Done()
		}()

		wg.Wait()
		close(fanin)
	}(even, odd, fanin)

	for v := range fanin {
		fmt.Println(v)
	}

	fmt.Println("exit")
}

func faninExam2() {
	c := fanIn(boring("Ahn"), boring("Kim"))
	for i := 0; i < 10; i++ {
		fmt.Println(<-c)
	}
	fmt.Println("You're both boring; I'm leaving.")
}

func boring(msg string) <-chan string {
	c := make(chan string)
	go func() {
		for i := 0; ; i++ {
			c <- fmt.Sprintf("%s %d", msg, i)
			time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
		}
	}()
	return c
}

func fanIn(input1, input2 <-chan string) <-chan string {
	c := make(chan string)
	go func() {
		for {
			c <- <-input1
		}
	}()
	go func() {
		for {
			c <- <-input2
		}
	}()
	return c
}
