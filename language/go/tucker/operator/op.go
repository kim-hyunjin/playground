package operator

import "fmt"

func Test() {
	// 변수를 선언하는 다양한 방법
	a := 4
	b := 2
	// var c int
	// c = 5
	// var d = 6
	// var e = 3.14
	// var f int = 8

	// %v(value) - 타입은 값에 따라 맞춰짐
	fmt.Printf("a&b = %v\n", a&b) // and
	fmt.Printf("a|b = %v\n", a|b) // or
	fmt.Printf("a^b = %v\n", a^b) // xor, ^는 이항연산자로 쓰면 xor 이고, 단항연산자로 쓰면 not(0 -> 1, 1 -> 0)임.

	c := 21
	d := c % 10
	c = c / 10
	e := c % 10
	fmt.Printf("%v %v\n", d, e)

	fmt.Println(d & ^d)

	fmt.Println(a >> 1)
	fmt.Println(a << 1)
}
