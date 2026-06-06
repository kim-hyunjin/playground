package basic

import (
	"fmt"
	"strings"
)

type person struct {
	name string
	age int
	favFood []string
}

func multiply(a, b int) int {
	return a * b
}

// return
func lenAndUpper(name string) (int, string) {
	return len(name), strings.ToUpper(name)
}

// naked return
func lenAndUpper2(name string) (length int, uppercase string) {
	defer fmt.Println("I'm done") // 함수가 리턴할 때 수행할 작업
	length = len(name)
	uppercase = strings.ToUpper(name)
	return
}

// ...args
func repeatMe(words ...string) {
	fmt.Println(words)
}

// for, range
func superAdd(numbers ...int) int {
	total := 0
	for _, number := range numbers {
		total += number
	}
	/*
	for i := 0; i < len(numbers); i++ {
		total += numbers[i]
	}
	*/
	return total
}

// if
func canIDrink(age int) bool {
	if koreanAge := age + 2; koreanAge < 18 { // if 조건문에서 변수를 선언할 수 있다.
		return false
	}
	return true
}

// switch
func canIDrink2(age int) bool {
	switch koreanAge := age + 2; {
	case koreanAge < 18:
		return false
	case koreanAge == 18:
		return true
	case koreanAge > 50:
		return false
	}
	return true
}

func exam() {
	fmt.Println(multiply(2, 2))
	len, upperName := lenAndUpper("hyunjin")
	fmt.Println(len, upperName)
	len2, _ := lenAndUpper("hyunjin")
	fmt.Println(len2)

	fmt.Println(lenAndUpper2("kim"))

	repeatMe("abc", "def", "ghi", "jkl")

	total := superAdd(1, 2, 3, 4, 5, 6, 7, 8)
	fmt.Println(total)

	fmt.Println(canIDrink(16))
	fmt.Println(canIDrink2(16))

	// pointer
	a := 2
	b := &a
	a = 5
	fmt.Println(a, *b)
	*b = 2021
	fmt.Println(a, *b)

	// array, slice
	names := [5]string{"nico", "lynn", "dal"} // not slice, array
	names[3] = "abcd"
	names[4] = "lalala"
	fmt.Println(names)
	names2 := []string{"nico", "lynn", "dal"} // slice
	names2 = append(names2, "hyunjin")
	fmt.Println(names2)

	// map
	nico := map[string]string{"name" : "nico", "age": "12"} // map[key_type]value_type
	fmt.Println(nico)
	for key, value := range nico {
		fmt.Println(key, value)
	}

	// struct
	favFood := []string{"strawberry", "ramen"}
	// hyunjin := person{"hyunjin", 28, favFood}
	hyunjin := person{name: "hyunjin", age: 28, favFood: favFood}
	fmt.Println(hyunjin)
}