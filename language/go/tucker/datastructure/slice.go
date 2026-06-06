package datastructure

import "fmt"

func PracticeSlice() {
	var a []int                         // 동적 배열 선언
	fmt.Printf("len(a) = %d\n", len(a)) // 0

	var b = []int{1, 2, 3, 4}
	fmt.Printf("len(b) = %d\n", len(b)) // 4

	var c = make([]int, 3, 8)           // 0 ~ 2번 인덱스는 0으로 채우고, capacity는 8
	fmt.Printf("len(c) = %d\n", len(c)) // 3
	fmt.Printf("cap(c) = %d\n", cap(c)) // 8
}

func PracticeAppend() {
	a := []int{1, 2}
	b := append(a, 3)
	fmt.Printf("a: %p\nb: %p\n", a, b) // a와 b는 서로 다른 주소. a배열에 여유 공간이 없기 때문에 배열을 새로 만들어 새 요소를 추가함.

	for i := 0; i < len(a); i++ {
		fmt.Printf("%d, ", a[i])
	}
	fmt.Println()
	for i := 0; i < len(b); i++ {
		fmt.Printf("%d, ", b[i])
	}
	fmt.Println()
	fmt.Printf("cap(a) : %d\n", cap(a))
	fmt.Printf("cap(b) : %d\n", cap(b))

	c := make([]int, 2, 4)
	d := append(c, 3)

	fmt.Printf("c: %p\nd: %p\n", c, d) // c와 d는 같은 주소. c에 여유 공간이 있기 때문에 배열을 새로 만들지 않고, c배열에 새 원소를 추가함.

	d[0] = 4
	d[1] = 5
	fmt.Println(c) // c와 d가 같은 주소이므로, d배열의 원소값을 바꾸면 c배열의 원소값도 바뀜
	fmt.Println(d)

	// 결론
	// 위와 같은 이유로 실수하는 경우가 많으므로, 애초에 배열과 append의 결과가 서로 다른 배열이라고 생각하고 코드를 작성하는 편이 좋다.
	// 또는 아래와 같이 미리 복사하면서 공간을 미리 확보한 후 append한다.
	arr := make([]int, 2, 4)
	arr[0] = 1
	arr[1] = 2
	arr2 := make([]int, len(a))

	for i := 0; i < len(arr); i++ {
		arr2[i] = arr[i]
	}

	arr2 = append(b, 3)

	fmt.Printf("arr: %p, arr2: %p\n", arr, arr2)

	arr2[0] = 4
	arr2[1] = 5
	fmt.Println(arr)
	fmt.Println(arr2)

	// 또는 아래와 같은 경우엔 상관없음
	var arr3 []int
	arr3 = append(arr3, 1)
	arr3 = append(arr3, 2)
	arr3 = append(arr3, 3)
	fmt.Println(arr3)
}

func SliceaSlice() {
	a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	b := a[4:6] // 이 경우 배열의 4번째 인덱스 부터 6번째 인덱스 앞까지(즉, 5번째 인덱스까지) 데이터를 가져옴.
	fmt.Println(b)

	b = a[4:] // 끝 인덱스를 생략하면 시작 인덱스부터 배열 끝까지 데이터를 가져온다.
	fmt.Println(b)

	b = a[:10] // 시작 인덱스를 생략하면 처음부터 끝 인덱스 앞까지 데이터를 가져온다.
	fmt.Println(b)

	// slice는 어떻게 동작할까?
	// 기존 배열을 잘라오는 것이 아니라 일부분만을 가리킨다.
	a[4] = 999
	fmt.Println(b) // b를 출력해보면 4번째 인덱스 값이 999로 바뀌어 있는것을 알 수 있다.

	// b의 값을 바꿔도 a의 값도 바뀐다.
	b[0] = 333
	fmt.Println(a)

	var back int
	for i := 0; i < 5; i++ {
		a, back = RemoveBack(a)
		fmt.Printf("%d, ", back)
	}
	fmt.Println(a)

	var front int
	for i := 0; i < 5; i++ {
		a, front = RemoveFront(a)
		fmt.Printf("%d, ", front)
	}
	fmt.Println(a)

	// slice는 결국 똑같은 Fixed array를 다루므로
	// 서로 다른 값을 가지게 하고 싶다면, 복사하는 과정을 거쳐야 한다.

}

func SliceDeepPractice() {
	var s []int

	s = make([]int, 3)
	/*
	  메모리에 int형 3개만큼의 주소를 준비하고,
	  Slice struct를 만들어 pointer에 배열의 시작 주소, len과 cap에 3을 넣는다.
	*/

	s[0] = 100
	s[1] = 200
	s[2] = 300

	fmt.Println(s, len(s), cap(s))
	fmt.Printf("%p\n", s)

	s = append(s, 400, 500, 600, 700)
	/*
		Slice stuct의 property인 cap, len을 사용해(cap - len) 빈 공간이 있는지 확인 후,
		빈 공간이 없다면 새로운 배열을 만들고 새 Slice struct를 만들어 덮어쓴다.
	*/

	fmt.Println(s, len(s), cap(s))
	fmt.Printf("%p\n", s)

	s = append(s, 800)
	fmt.Println(s, len(s), cap(s))
	fmt.Printf("%p\n", s)
}

func RemoveBack(a []int) ([]int, int) {
	return a[:len(a)-1], a[len(a)-1]
}

func RemoveFront(a []int) ([]int, int) {
	return a[1:], a[0]
}
