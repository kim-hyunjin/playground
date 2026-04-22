package section17pointer

import "fmt"

type person struct {
	name string
}

func exercise1() {
	x := 42
	fmt.Println(x)
	fmt.Println(&x)

	p1 := person{
		name: "James Bond",
	}
	fmt.Println(p1)
	fmt.Println(&p1)
}

func exercise2() {
	p1 := person{
		name: "James Bond",
	}
	fmt.Println(p1)
	changeMe(&p1)
	fmt.Println(p1)
}

func changeMe(p *person) {
	p.name = "Miss Moneypenny"
}