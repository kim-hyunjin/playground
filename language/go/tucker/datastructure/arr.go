package datastructure

import "fmt"

func Arr() {
	// A:= [10]int{1,2,3,4,5,6,7,8,9,10}
	B := [10]int{}
	for i := 0; i < len(B); i++ { // len : 배열의 길이를 반환하는 내장함수
		B[i] = i * i
	}
	fmt.Println(B)
}

func Arr2() {
	s := "hello 월드" // go 문자열은 utf-8 사용. s는 byte배열임.

	fmt.Printf("len(s) = %d\n", len(s))

	for i := 0; i < len(s); i++ {
		fmt.Println(string(s[i])) // byte배열을 순회하면 1바이트씩 읽기때문에 3바이트 한글은 깨짐
	}
}

func Arr3() {
	s := "hello 월드"
	s2 := []rune(s) // rune은 utf-8을 담는 데이터 타입
	fmt.Printf("len(s2) = %d\n", len(s2))

	for i := 0; i < len(s2); i++ {
		fmt.Println(string(s2[i]))
	}
}

func ArrCopy() {
	arr := [5]int{1, 2, 3, 4, 5}
	clone := [5]int{}
	for i := 0; i < len(arr); i++ {
		clone[i] = arr[i]
	}
	fmt.Println(clone)
}

func ArrReverseCopy() {
	arr := [5]int{1, 2, 3, 4, 5}
	clone := [5]int{}
	for i := 0; i < len(arr); i++ {
		clone[i] = arr[len(arr)-1-i]
	}
	fmt.Println(clone)
}

func Sort1() {
	// 역순으로 정렬하기
	arr := [5]int{1, 2, 3, 4, 5}

	for i := 0; i < len(arr)/2; i++ {
		arr[i], arr[len(arr)-1-i] = arr[len(arr)-1-i], arr[i]
	}

	fmt.Println(arr)
}

func Sort2() {
	// Radix Sort - 원소의 개수가 한정적인 경우 사용
	arr := [11]int{0, 3, 6, 7, 3, 5, 4, 9, 6, 8, 2}
	temp := [10]int{} // 원소는 0 ~ 9 이므로 int 10개 길이 배열

	for i := 0; i < len(arr); i++ {
		idx := arr[i]
		temp[idx]++
	}

	idx := 0
	for i := 0; i < len(temp); i++ {
		for j := 0; j < temp[i]; j++ {
			arr[idx] = i
			idx++
		}
	}
	fmt.Println(arr)

}
