package functest

import "fmt"

// x와 y는 모두 int
func Add(x, y int) int { // go 에서는 함수 호출 시 값이 복사된다. (참조가 없음.)
	return x + y
}

func Fun1(x, y int) (int, int) { // 리턴 값을 여러개 정할 수 있음.
	return y, x // 복수개 리턴
}

func Fun2(x int) {
	if x == 0 {
		return
	}
	fmt.Printf("Fun2(%d) before call Fun2(%d)\n", x, x-1)
	Fun2(x - 1)
	fmt.Printf("Fun2(%d) after call Fun2(%d)\n", x, x-1)
}

func Sum(x, s int) int {
	if x == 0 {
		return s
	}
	s += x
	return Sum(x-1, s)
}

// 모든 재귀호출은 반복문으로 바꿀 수 있다.
func Sum2(x, y int) int {
	for i := 1; i <= x; i++ {
		y += i
	}
	return y
}
