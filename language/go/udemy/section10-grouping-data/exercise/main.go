package main

import "fmt"

func main() {
	exercise1()
	exercise2()
	exercise3()
	exercise4()
	exercise5()
	exercise6()
	exercise7()
	exercise8()
	exercise9()
	exercise10()
}

func exercise1() {
	// usint composite literal
	arr := [5]int{1, 2, 3, 4, 5}

	for _, v := range arr {
		fmt.Println(v)
	}
	fmt.Printf("%T\n", arr)
}

func exercise2() {
	slice := []int{42, 43, 44, 45, 46, 47, 48, 49, 50, 51}
	for _, v := range slice {
		fmt.Println(v)
	}
	fmt.Printf("%T\n", slice)
}

func exercise3() {
	slice := []int{42, 43, 44, 45, 46, 47, 48, 49, 50, 51}
	fmt.Println(slice[:5])
	fmt.Println(slice[5:])
	fmt.Println(slice[2:7])
	fmt.Println(slice[1:6])
}

func exercise4() {
	slice := []int{42, 43, 44, 45, 46, 47, 48, 49, 50, 51}
	
	slice = append(slice, 52)
	fmt.Println(slice)
	
	slice = append(slice, 53, 54, 55)
	fmt.Println(slice)
	
	y := []int{56, 57, 58, 59, 60}
	slice = append(slice, y...)
	fmt.Println(slice)
}

func exercise5() {
	slice := []int{42, 43, 44, 45, 46, 47, 48, 49, 50, 51}
	y := append(slice[:3], slice[6:]...)
	fmt.Println(y)
}

func exercise6() {
	states := make([]string, 50)

	/*
	states = append(states, ` Alabama`, ` Alaska`, ` Arizona`, ` Arkansas`, ` California`, ` Colorado`, ` Connecticut`, `
	Delaware`, ` Florida`, ` Georgia`, ` Hawaii`, ` Idaho`, ` Illinois`, ` Indiana`, ` Iowa`, ` Kansas`, `
	Kentucky`, ` Louisiana`, ` Maine`, ` Maryland`, ` Massachusetts`, ` Michigan`, ` Minnesota`, `
	Mississippi`, ` Missouri`, ` Montana`, ` Nebraska`, ` Nevada`, ` New Hampshire`, ` New Jersey`,
	` New Mexico`, ` New York`, ` North Carolina`, ` North Dakota`, ` Ohio`, ` Oklahoma`, ` Oregon`,
	` Pennsylvania`, ` Rhode Island`, ` South Carolina`, ` South Dakota`, ` Tennessee`, ` Texas`, `
	Utah`, ` Vermont`, ` Virginia`, ` Washington`, ` West Virginia`, ` Wisconsin`, ` Wyoming`,)

	fmt.Println(len(states)) // 100
	fmt.Println(cap(states)) // 112
*/
	y := []string{` Alabama`, ` Alaska`, ` Arizona`, ` Arkansas`, ` California`, ` Colorado`, ` Connecticut`, `
	Delaware`, ` Florida`, ` Georgia`, ` Hawaii`, ` Idaho`, ` Illinois`, ` Indiana`, ` Iowa`, ` Kansas`, `
	Kentucky`, ` Louisiana`, ` Maine`, ` Maryland`, ` Massachusetts`, ` Michigan`, ` Minnesota`, `
	Mississippi`, ` Missouri`, ` Montana`, ` Nebraska`, ` Nevada`, ` New Hampshire`, ` New Jersey`,
	` New Mexico`, ` New York`, ` North Carolina`, ` North Dakota`, ` Ohio`, ` Oklahoma`, ` Oregon`,
	` Pennsylvania`, ` Rhode Island`, ` South Carolina`, ` South Dakota`, ` Tennessee`, ` Texas`, `
	Utah`, ` Vermont`, ` Virginia`, ` Washington`, ` West Virginia`, ` Wisconsin`, ` Wyoming`,}

	/*
	// use copy instead of loop
	for i, v := range y {
		states[i] = v
	}
	*/

	copied := copy(states, y)
	fmt.Println("copied: ", copied)

	fmt.Println(states)
	fmt.Println(len(states)) // 50
	fmt.Println(cap(states)) // 50

	for i := 0; i < len(states); i++ {
		fmt.Println(states[i])
	}

	/*
	states[51] = "elsewhere" // index out of range
	fmt.Println(states)
	fmt.Println(len(states))
	fmt.Println(cap(states))
	*/
}

func exercise7() {
	s1 := []string{"James", "Bond", "Shaken, not stirred"}
	s2 := []string{"Miss","Moneypenny","Hellooooo, James"}

	s3 := [][]string{s1, s2}

	for _, s := range s3 {
		for _, v := range s {
			fmt.Println(v)
		}
	}
}

func exercise8() {
	var fav map[string][]string = map[string][]string{
		"kim": []string{`bond_james`, `Shaken, not stirred`, `Martinis`, `Women`},
		"perez": []string{`moneypenny_miss`, `James Bond`, `Literature`, `Computer Science`},
		"max": []string{`no_dr`, `Being evil`, `Ice cream`, `Sunsets`},
	}

	

	for k, v := range fav {
		fmt.Println("This is the record for key: ", k)
		for i, v2 := range v {
			fmt.Println("\t", i, v2)
		}
	}
}

func exercise9() {
	m := map[string][]string{}
	m[`fleming_ian`] = []string{`steaks`, `cigars`, `espionage`}

	fmt.Println(m)
}

func exercise10() {
	m := map[string][]string{}
	m[`fleming_ian`] = []string{`steaks`, `cigars`, `espionage`}

	delete(m, "fleming_ian")

	fmt.Println(m)
}