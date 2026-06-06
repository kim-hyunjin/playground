package main

import "fmt"

func main() {
	bread := &Bread{val: "bread"}
	// jam := &StrawberryJam{}
	// jam := &OrangeJam{}
	jam := &AppleJam{}

	bread.PutJam(jam)

	fmt.Println(bread.String())
	PrintTest()
}
