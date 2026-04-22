package functest

func Fibonacci(x int) int { // 반복문보다 느리지만 수학적 정의를 표현하기 좋다.
	if x == 0 {
		return 1
	}
	if x == 1 {
		return 1
	}
	return Fibonacci(x-1) + Fibonacci(x-2)
}

// Haskel, Lisp, Scala와 같은 함수형 언어들은 재귀호출을 성능문제 없이 수행하지만 go는 함수형언어는 아니다.

func Fibonacci2(x int) int {
	a := 1
	b := 0
	var c int
	for i := 0; i < x; i++ {
		c = a
		a += b
		b = c
	}
	return a
}
