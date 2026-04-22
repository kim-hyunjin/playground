package main

import (
	"fmt"
	"strconv"
)

type Printable interface {
	String() string
}

func Println(p Printable) {
	fmt.Println(p.String())
}

type StructA struct {
	val string
}

func (s *StructA) String() string {
	return s.val
}

type StructB struct {
	val int
}

func (s *StructB) String() string {
	return strconv.Itoa(s.val)
}

func PrintTest() {
	a := &StructA{val: "aaa"}
	b := &StructB{val: 7}
	Println(a)
	Println(b)
}
