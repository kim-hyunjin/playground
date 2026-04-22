package datastructure

import "fmt"

type Student2 struct {
	name  string
	age   int
	grade int
}

func SetName(t Student2, newName string) {
	t.name = newName
}

func SetName2(t *Student2, newName string) {
	t.name = newName
}

func (t *Student2) SetName3(newName string) { // Student2의 메소드
	t.name = newName
}

func (t *Student2) SetAge(age int) {
	t.age = age
}

func InstanceTest() {
	a := Student2{"aaa", 20, 10}

	b := a // 값이 복사됨. Value type
	b.age = 30
	fmt.Println(b) // 따라서 b와 a는 별개임.

	var c *Student2
	c = &a // a변수의 주소가 복사됨. reference type
	c.age = 40
	fmt.Println(c) // 따라서 c의 값을 바꾸면 a의 값도 바뀜.(같은 주소를 가리키므로)

	SetName(a, "bbb") // 파라미터로 값이 넘어가므로 a의 이름이 바뀌지 않음.
	fmt.Println(a)
	SetName2(&a, "bbb") // 파라미터로 주소가 넘어가므로 a의 이름이 바뀜.
	fmt.Println(a)

	// a는 인스턴스
	a.SetName3("333")
	fmt.Println(a)

	var michel *Student2
	michel = &Student2{"michel", 20, 10}
	michel.SetAge(25)
	fmt.Println(michel)
	/*
		OOP의 등장으로 주체가 생겼고, michel.SetAge(25) 와 같이 주체와 그 행위를 규정할 수 있게 되었다.
		여기서 이 주체를 인스턴스라 부른다. 인스턴스는 추상적인 생명체(?)로서 생명주기를 가진다.
	*/

}
