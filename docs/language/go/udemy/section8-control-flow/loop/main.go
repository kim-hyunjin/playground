package main

import "fmt"

// for [condition | for clause | range clause] block
func main() {
	a := 1

	for a < 10 {
		fmt.Printf("%d ", a)
		a++
	}

	fmt.Println()

	for i := 0; i < 10; i++ {
		fmt.Printf("%d ", i)
	}

	fmt.Println()

	x := 1
	for {
		x++

		if x > 100 {
			break
		}
		if x % 2 != 0 {
			continue
		}
		fmt.Printf("%d ", x)
	}

	fmt.Println()

	for i := 33; i <= 122; i++ {
		fmt.Printf("%v\t%#x\t%#U\n", i, i, i)
	}
}