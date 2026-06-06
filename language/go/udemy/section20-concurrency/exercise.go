package section20concurrency

import (
	"fmt"
	"runtime"
	"sync"
	"sync/atomic"
)

// use wait group
func exercise1() {

	fmt.Println("begin cpu", runtime.NumCPU())
	fmt.Println("begin gs", runtime.NumGoroutine())

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		fmt.Println("hello from thing one")
		wg.Done()
	}()

	go func() {
		fmt.Println("hello from thing two")
		wg.Done()
	}()

	fmt.Println("mid cpu", runtime.NumCPU())
	fmt.Println("mid gs", runtime.NumGoroutine())

	wg.Wait()
	fmt.Println("about to exit")
	fmt.Println("end cpu", runtime.NumCPU())
	fmt.Println("end gs", runtime.NumGoroutine())
}

// create race condition
func exercise2() {
	incrementor := 0


	gs := 100
	var wg sync.WaitGroup
	wg.Add(gs)

	for i := 0; i <gs; i++ {
		go func(index int) {
			fmt.Println("read by", index, " : ", incrementor)
			newVal := incrementor
			runtime.Gosched()
			newVal++
			incrementor = newVal
			fmt.Println("done by", index, " : ", incrementor)
			wg.Done()
		}(i)
	}

	wg.Wait()
	fmt.Println("end value:", incrementor)
}

// mutex
func exercise3() {
	incrementor := 0

	gs := 100
	var wg sync.WaitGroup
	wg.Add(gs)

	var mu sync.Mutex

	for i := 0; i <gs; i++ {
		go func(index int) {
			mu.Lock()
			fmt.Println("read by", index, " : ", incrementor)
			newVal := incrementor
			newVal++
			incrementor = newVal
			fmt.Println("done by", index, " : ", incrementor)
			mu.Unlock()
			wg.Done()
		}(i)
	}

	wg.Wait()
	fmt.Println("end value:", incrementor)
}

// atomic
func exercise4() {
	var incrementor int64 = 0

	gs := 100
	var wg sync.WaitGroup
	wg.Add(gs)


	for i := 0; i <gs; i++ {
		go func(index int) {
			fmt.Println("read by", index, " : ", atomic.LoadInt64(&incrementor))
			atomic.AddInt64(&incrementor, 1)
			fmt.Println("done by", index, " : ", atomic.LoadInt64(&incrementor))
			wg.Done()
		}(i)
	}

	wg.Wait()
	fmt.Println("end value:", incrementor)
}
