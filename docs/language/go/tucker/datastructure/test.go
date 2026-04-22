package datastructure

import "fmt"

type Key struct {
	v int
}

type Value struct {
	v int
}

func GoMapPractice() {
	// var m1 map[int]string
	// var m2 map[Key]Value
	// var m3 map[Key]*Value
	var m map[string]string // 대괄호 안에 key 타입, 밖에 value 타입
	m = make(map[string]string)
	m["홍길동"] = "멋쟁이" // map[key] = value
	fmt.Println(m["홍길동"])

	m1 := make(map[int]string)
	m1[0] = "홍길동"
	m1[1] = "철수"
	m1[2] = "영희"
	fmt.Println(m1[0])
	fmt.Println("m1[99] = ", m1[99]) // string의 기본형태인 빈 문자열이 리턴됨

	m2 := make(map[int]int)
	m2[0] = 123
	fmt.Println(m2[99]) // int의 기본값인 0이 출력됨

	// 위와 같은 성질을 이용해 Set을 만들 수 있다.
	// 값이 존재하는지 확인하기
	m3 := make(map[int]bool)

	m3[0] = true
	m3[2] = false
	fmt.Println(m3[0])
	fmt.Println(m3[1]) // bool의 기본값인 false가 출력됨
	fmt.Println(m3[2]) // 다만 직접 설정한 값인지 기본값인지 구분이 안된다.

	v1, isExist := m3[2] // go에서는 두번째 리턴값으로 실제 존재하는 bool형값을 리턴한다.
	fmt.Println(v1, isExist)
	v2, isExist := m3[3]
	fmt.Println(v2, isExist)

	// 맵에서 값 삭제하기
	delete(m2, 0)
	v, isExist := m2[0]
	fmt.Println(v, isExist)

	// map 순회하기
	m2[2] = 2
	m2[4] = 4
	m2[10] = 10
	m2[20] = 20
	for key, value := range m2 { // key 순서대로 나오진 않는다.
		fmt.Println(key, " = ", value)
	}
}

func MapTest() {
	mymap := CreateMap()
	mymap.Add("홍길동", "01012345678")
	mymap.Add("김철수", "01009876543")
	mymap.Add("이순신", "01045677654")

	fmt.Println("홍길동 = ", mymap.Get("홍길동"))
	fmt.Println("김철수 = ", mymap.Get("김철수"))
	fmt.Println("이순신 = ", mymap.Get("이순신"))
	fmt.Println("이춘향 = ", mymap.Get("이춘향"))
}

func HashTest() {
	fmt.Println("abcde => ", Hash("abcde"))
	fmt.Println("abcde => ", Hash("abcde"))
	fmt.Println("qwer => ", Hash("qwer"))
	fmt.Println("hello, my name is hyunjin => ", Hash("hello, my name is hyunjin"))
}

func MinHeapTest() {
	/* 알고리즘 문제
	[-1, 3, -1, 5, 4] 배열에서 2번째로 큰 값 찾기
	*/
	h := &MinHeap{}
	nums := []int{-1, 3, -1, 5, 4}
	for i := 0; i < len(nums); i++ {
		h.Push(nums[i])
		if h.Count() > 2 {
			h.Pop()
		}
	}
	fmt.Println(h.Pop())

	/*
		Input: [2, 4, -2, -3, 8], 1
		Output: 8
	*/
	h = &MinHeap{}
	nums = []int{2, 4, -2, -3, 8}
	for i := 0; i < len(nums); i++ {
		h.Push(nums[i])
		if h.Count() > 1 {
			h.Pop()
		}
	}
	fmt.Println(h.Pop())

	/*
		Input: [-5, -3, 1], 3
		Output: -5
	*/
	h = &MinHeap{}
	nums = []int{-5, -3, 1}
	for i := 0; i < len(nums); i++ {
		h.Push(nums[i])
		if h.Count() > 3 {
			h.Pop()
		}
	}
	fmt.Println(h.Pop())
}

func HeapTest() {
	h := &Heap{}
	h.Push(9)
	h.Push(7)
	h.Push(5)
	h.Push(6)
	h.Push(8)

	h.Print()
	fmt.Println(h.Pop())
	fmt.Println(h.Pop())
	fmt.Println(h.Pop())

}

func BinaryTreeTest() {
	tree := NewBinaryTree(5)
	tree.Root.AddNode(3)
	tree.Root.AddNode(2)
	tree.Root.AddNode(4)
	tree.Root.AddNode(8)
	tree.Root.AddNode(7)
	tree.Root.AddNode(6)
	tree.Root.AddNode(10)
	tree.Root.AddNode(9)

	/*
			      5
		        /\
		       3  8
		      /\ /\
		     2 4 7 10
			      /  /
		       6  9

	*/
	tree.Print()
	fmt.Println()
	for {
		var inputNumbers int
		_, err := fmt.Scanf("%d\n", &inputNumbers)
		if err != nil {
			fmt.Println("\n잘못 입력하셨습니다.")
			continue
		}

		if inputNumbers == -1 {
			break
		}

		if found, cnt := tree.Search(inputNumbers); found {
			fmt.Println("\nfound, ", inputNumbers, "cnt: ", cnt)
		} else {
			fmt.Println("\nnot found, ", inputNumbers, "cnt: ", cnt)
		}
	}
}

func TreeTest() {
	tree := Tree{}
	val := 1
	tree.AddNode(val)
	val++

	for i := 0; i < 3; i++ {
		tree.Root.AddNode(val)
		val++
	}

	for i := 0; i < len(tree.Root.Children); i++ {
		for j := 0; j < 2; j++ {
			tree.Root.Children[i].AddNode(val)
			val++
		}
	}
	/*
			      1
		      / | \
		     2  3  4
		   /\  /\  /\
		  5 6 7 8 9 10
	*/
	fmt.Println("\nDFS with recursive call")
	tree.DFS()
	fmt.Println("\nDFS with stack")
	tree.DFSWithStack()
	fmt.Println("\nBFS")
	tree.BFS()
}

func StackTest() {
	stack := NewStack()

	for i := 1; i <= 5; i++ {
		stack.Push(i)
	}

	fmt.Println("New Stack")

	for !stack.Empty() {
		val := stack.Pop()
		fmt.Println(val)
	}
	// stack := []int{}
	// for i := 1; i <= 5; i++ {
	// 	stack = append(stack, i)
	// }

	// fmt.Println(stack)

	// for len(stack) > 0 {
	// 	var last int
	// 	last, stack = stack[len(stack)-1], stack[:len(stack)-1]
	// 	fmt.Println(last)
	// }
}

func QueueTest() {
	queue := NewQueue()

	for i := 1; i <= 5; i++ {
		queue.Push(i)
	}

	fmt.Println("New Queue")
	for !queue.Empty() {
		val := queue.Pop()
		fmt.Println(val)
	}

	// queue := []int{}
	// for i := 1; i <= 5; i++ {
	// 	queue = append(queue, i)
	// }

	// fmt.Println(queue)

	// for len(queue) > 0 {
	// 	var front int
	// 	front, queue = queue[0], queue[1:]
	// 	fmt.Println(front)
	// }
}

func LinkedListTest() {
	list := &LinkedList{}
	list.AddNode(0)

	for i := 1; i < 10; i++ {
		list.AddNode(i)
	}

	list.PrintNode()

	list.RemoveNode(list.Root)
	list.PrintNode()

	list.RemoveNode(list.Tail)
	list.PrintNode()

	list.RemoveNode(list.Root.Next)
	list.PrintNode()
	list.PrintReverse()
}
