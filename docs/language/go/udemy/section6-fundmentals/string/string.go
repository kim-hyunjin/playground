package main

import "fmt"

func main() {
	s := "Hello, playground"
	fmt.Println(s)
	fmt.Printf("%T\n", s) // print type, string

	bs := []byte(s)
	fmt.Println(bs)
	fmt.Printf("%T\n", bs) // []uint8

	for i := 0; i < len(s); i++ {
		fmt.Printf("%#U ", s[i]) // print utf
	}

	fmt.Println()

	for i, v := range s {
		fmt.Printf("at index position %d we have hex %#x\n", i, v)
	}
}