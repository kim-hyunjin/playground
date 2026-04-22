package datastructure

import "fmt"

type Node struct {
	Next *Node
	Prev *Node // 더블 링크드 리스트
	Val  int
}
type LinkedList struct {
	Root *Node
	Tail *Node
}

func (l *LinkedList) AddNode(Val int) {
	if l.Root == nil {
		l.Root = &Node{Val: Val}
		l.Tail = l.Root
		return
	}
	l.Tail.Next = &Node{Val: Val}
	Prev := l.Tail
	l.Tail = l.Tail.Next
	l.Tail.Prev = Prev
}

func (l *LinkedList) RemoveNode(target *Node) {
	if target == l.Root {
		l.Root = l.Root.Next
		if l.Root != nil {
			l.Root.Prev = nil
		}
		target = nil
		return
	}
	// 지울 노드의 이전 노드 찾기 => 더블링크드리스트로 만들어서 Prev를 찾는 부분이 필요없어짐.
	// Prev := l.Root
	// for Prev.Next != node {
	// 	Prev = Prev.Next
	// }
	if target == l.Tail {
		l.Tail = l.Tail.Prev
		l.Tail.Next = nil
	} else {
		target.Prev.Next = target.Next
		target.Next.Prev = target.Prev
	}
	target = nil
}

func (l *LinkedList) Back() int {
	if l.Tail != nil {
		return l.Tail.Val
	}
	return 0
}

func (l *LinkedList) PopBack() {
	if l.Tail == nil {
		return
	}
	l.RemoveNode(l.Tail)
}

func (l *LinkedList) Empty() bool {
	return l.Root == nil
}

func (l *LinkedList) Front() int {
	if l.Root != nil {
		return l.Root.Val
	}
	return 0
}

func (l *LinkedList) PopFront() {
	if l.Root == nil {
		return
	}
	l.RemoveNode(l.Root)
}

func (l *LinkedList) PrintNode() {
	node := l.Root
	for node.Next != nil {
		fmt.Printf("%d -> ", node.Val)
		node = node.Next
	}
	fmt.Printf("%d\n", node.Val)
}

func (l *LinkedList) PrintReverse() {
	node := l.Tail

	for node.Prev != nil {
		fmt.Printf("%d -> ", node.Val)
		node = node.Prev
	}
	fmt.Printf("%d\n", node.Val)
}
