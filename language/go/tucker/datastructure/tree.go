package datastructure

import "fmt"

type TreeNode struct {
	Val      int
	Children []*TreeNode
}

type Tree struct {
	Root *TreeNode
}

func (t *Tree) AddNode(val int) {
	if t.Root == nil {
		t.Root = &TreeNode{Val: val}
	} else {
		t.Root.Children = append(t.Root.Children, &TreeNode{Val: val})
	}
}

func (t *TreeNode) AddNode(val int) {
	t.Children = append(t.Children, &TreeNode{Val: val})
}

func (t *Tree) DFS() {
	DFS(t.Root)
}

func (t *Tree) DFSWithStack() {
	s := []*TreeNode{}
	s = append(s, t.Root)

	for len(s) > 0 {
		var last *TreeNode
		last, s = s[len(s)-1], s[:len(s)-1]

		fmt.Printf("%d->", last.Val)

		for i := len(last.Children) - 1; i >= 0; i-- {
			s = append(s, last.Children[i])
		}
	}
}

func (t *Tree) BFS() {
	queue := []*TreeNode{}
	queue = append(queue, t.Root)

	for len(queue) > 0 {
		var first *TreeNode
		first, queue = queue[0], queue[1:]

		fmt.Printf("%d->", first.Val)
		queue = append(queue, first.Children...)
	}
}

func DFS(node *TreeNode) {
	fmt.Printf("%d->", node.Val)

	for i := 0; i < len(node.Children); i++ {
		DFS(node.Children[i])
	}
}
