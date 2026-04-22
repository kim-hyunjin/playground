package section17pointer

import "testing"

func TestMethodSets(t *testing.T) {
	c := circle{5}
	// circle 타입은 area()메소드가 있으므로 shape 인터페이스 구현.
	// circle, *circle 두 타입 모두 shape 타입에 사용될 수 있다...
	info(c)
	info(&c)
}

func TestMethodSets2(t *testing.T) {
	r := rectangle{5}
	/*
	cannot use r (variable of type rectangle) as type shape in argument to info:
	rectangle does not implement shape (area method has pointer receiver)

	rectangle 타입은 area() 메소드가 없으므로 shape 인터페이스를 구현하지 않음
	*rectangle 타입은 area() 메소드가 있으므로 shape 인터페이스를 구현

	shape 타입으로 *rectangle 만 사용될 수 있다. 
	*/
	// info(r)
	info(&r)
}