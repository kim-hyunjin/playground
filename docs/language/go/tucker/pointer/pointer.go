package pointer

import "fmt"

type Student struct {
	name string
	age  int

	grade string
	class string
}

// 포인터를 사용해 주소를 참조할 수 있도록 한다.
func (s *Student) PrintGrade() {
	fmt.Println(s.class, s.grade)
}

func (s *Student) InputGrade(class string, grade string) {
	s.class = class
	s.grade = grade
}

func Exam1() {
	var a int
	var b int
	var p *int
	p = &a
	a = 3
	b = 2

	fmt.Println(a)
	fmt.Println(p)
	fmt.Println(*p)

	p = &b
	fmt.Println(b)
	fmt.Println(p)
	fmt.Println(*p)

}

func Exam2() {
	var a int
	a = 1
	Increase(&a)

	fmt.Println(a)
}

func Exam3() {
	var s Student = Student{name: "철수", age: 15, class: "수학", grade: "A"}

	s.InputGrade("과학", "C")
	s.PrintGrade()
}

func Increase(x *int) {
	*x++
}
