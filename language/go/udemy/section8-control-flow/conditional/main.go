package main

import "fmt"

func main() {
	if true {
		fmt.Println("001")
	}

	if false {
		fmt.Println("002")
	}

	if !true {
		fmt.Println("003")
	}

	if !false {
		fmt.Println("004")
	}

	if x := 42; x == 2 { // x limited in scope
		fmt.Println("005")
	}

	x := 42
	if x == 40 {
		fmt.Println("x is 40")
	} else if x == 41 {
		fmt.Println("x is not 41")
	} else {
		fmt.Println("x is not 40, 41")
	}

	switch {
	case false:
		fmt.Println("this should not print")
	case (2 == 4):
		fmt.Println("this should not print")
	case (3 == 3):
		fmt.Println("print 3==3")
		fallthrough
	case (4 == 4):
		fmt.Println("also true, does it print?")
		fallthrough
	case (4 == 9):
		fmt.Println("not true, does it print?")
		fallthrough
	case (11 == 14):
		fmt.Println("not true, does it print?")
		fallthrough
	case (15 == 15):
		fmt.Println("not true, does it print?")
	default:
		fmt.Println("this is default")
	}

	n:= "Bond"
	switch n {
	case "Moneypenny", "Bond", "Do No":
		fmt.Println("miss money or bond or dr no")
	case "M":
		fmt.Println("this is m")
	case "Q":
		fmt.Println("this is q")
	default:
		fmt.Println("this is default")
	}
}
