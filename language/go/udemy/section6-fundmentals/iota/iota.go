package main

import "fmt"

// iota는 상수마다 별도로 적용된다.
const (
	zero = iota	// 0
	one = iota	// 1
)
const (
	two = iota	// 0
	three = iota	// 1
)

// JAN to DEC using itoa
const (
	JAN = iota + 1
	FEB
	MAR
	APR
	MAY
	JUN
	JUL
	AUG
	SEP
	OCT
	NOV
	DEC
) //월

const (
	ㄱ = iota * iota	// 0
	ㄴ			// 1
	ㄷ			// 4
	ㄹ			// 9
)

const (
	_ = iota
	kb = 1 << (iota * 10)
	mb
	gb
	tb
	pb
)

func main() {
	fmt.Println("JAN:", JAN)
	fmt.Println("JUL:", JUL)
	fmt.Println("DEC:", DEC)
}