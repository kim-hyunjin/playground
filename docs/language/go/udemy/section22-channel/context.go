package section22channel

import (
	"context"
	"fmt"
	"runtime"
	"time"
)

func contextExam() {
	ctx, cancel := context.WithCancel(context.Background())

	fmt.Println("error check 1:", ctx.Err())                 // nil
	fmt.Println("num goroutines 1:", runtime.NumGoroutine()) // 2

	go func() {
		n := 0
		for {
			select {
			case <-ctx.Done():
				return
			default:
				n++
				time.Sleep(time.Millisecond * 200)
				fmt.Println("working", n)
			}
		}
	}()

	time.Sleep(time.Second * 2)
	fmt.Println("error check 2:", ctx.Err())                 // nil
	fmt.Println("num goroutines 2:", runtime.NumGoroutine()) // 3

	fmt.Println("about to cancel context")
	cancel()
	fmt.Println("canceled context")

	time.Sleep(time.Second * 2)
	fmt.Println("error check 3:", ctx.Err())                 // context canceled
	fmt.Println("num goroutines 3:", runtime.NumGoroutine()) // 2
}

func contextExam2() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	for v := range gen(ctx) {
		fmt.Println(v)
		if v == 5 {
			break
		}
	}
}

func gen(ctx context.Context) <-chan int {
	dst := make(chan int)
	n := 1
	go func() {
		for {
			select {
			case <-ctx.Done():
				return

			case dst <- n:
				n++
			}
		}
	}()
	return dst
}
