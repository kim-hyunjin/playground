package datastructure

import "fmt"

// 다른 프로그래밍 언어의 class와 같은 개념
type Person struct {
	name string
	age  int
}

// Person에 속한 메서드
func (p Person) PrintName() {
	fmt.Print("내 이름은 ", p.name, "입니다.")
}

type Student struct {
	name  string
	class int
	score Score
}

type Score struct {
	name  string
	grade string
}

func (s Student) ViewScore() {
	fmt.Println(s.score)
}

func (s Student) InputScore(name string, grade string) {
	s.score.name = name
	s.score.grade = grade
}

func Struct1() {
	var p1 Person
	p2 := Person{"개똥이", 15}
	p3 := Person{name: "홍길동", age: 20}
	p4 := Person{name: "춘향이"}
	p5 := Person{}

	fmt.Println(p1, p2, p3, p4, p5)

	p1.name = "이순신"
	p1.age = 30

	fmt.Println(p1)

	p1.PrintName()
}

func Struct2() {
	var s Student
	s.name = "철수"
	s.class = 1

	s.score.name = "수학"
	s.score.grade = "C"
	s.InputScore("과학", "A")
	s.ViewScore() // {수학 C}가 출력된다. GO에서는 함수에서 주소참조가 아닌 값 복사가 이루어지기 때문
}
