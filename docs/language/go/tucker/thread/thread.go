package thread

import (
	"fmt"
	"time"
)

func Test() {
	go func1() // go thread로 해당 함수를 수행
	for i := 0; i < 20; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("Test: ", i)
	}
}

func func1() {
	for i := 0; i < 10; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println("func1: ", i)
	}
}
