package main

import "fmt"

func pop(c chan int) {
	fmt.Println("pop func")
	v := <-c // c에 값이 생겨 뺄 수 있을 때까지 대기한다.
	fmt.Println(v)
}

func main() {
	var c chan int
	c = make(chan int, 1)

	c <- 10
	v := <-c

	fmt.Println(v)

	c2 := make(chan int)
	go pop(c2)
	c2 <- 20 // 길이가 0이므로 다른 곳에서 채널의 값을 빼줄 때까지 기다린다.
	// v = <-c2

	// fmt.Println("end of program")

	// FactoryTest()
	SelectTest()
}
