package datastructure

import "fmt"

type Heap struct {
	list []int
}

func (h *Heap) Push(v int) {
	h.list = append(h.list, v)

	idx := len(h.list) - 1
	for idx >= 0 {
		parentIdx := (idx - 1) / 2 // 부모 idx 구하기
		if parentIdx < 0 {
			break
		}
		if h.list[idx] > h.list[parentIdx] {
			// 부모노드보다 값이 크면 부모노드와 자리를 바꾼다.
			h.list[idx], h.list[parentIdx] = h.list[parentIdx], h.list[idx]
			idx = parentIdx
		} else {
			break
		}
	}
}

func (h *Heap) Print() {
	fmt.Println(h.list)
}

func (h *Heap) Pop() int {
	if len(h.list) == 0 {
		return 0
	}

	top := h.list[0]
	last := h.list[len(h.list)-1]
	h.list = h.list[:len(h.list)-1]

	h.list[0] = last
	idx := 0
	for idx < len(h.list) {
		swapIdx := -1
		leftIdx := idx*2 + 1
		// 자식 노드가 없는 경우
		if leftIdx >= len(h.list) {
			break
		}
		// 왼쪽 자식노드가 큰 경우
		if h.list[leftIdx] > h.list[idx] {
			swapIdx = leftIdx
		}

		rightIdx := idx*2 + 2
		// 오른쪽 자식노드가 존재하며, 부모노드와 왼쪽 자식노드보다 큰 경우
		if rightIdx < len(h.list) {
			if h.list[rightIdx] > h.list[idx] {
				if swapIdx >= 0 && h.list[swapIdx] < h.list[rightIdx] {
					swapIdx = rightIdx
				}
			}
		}

		if swapIdx < 0 {
			break
		}

		h.list[idx], h.list[swapIdx] = h.list[swapIdx], h.list[idx]
		idx = swapIdx
	}
	return top
}

type MinHeap struct {
	list []int
}

func (h *MinHeap) Push(v int) {
	h.list = append(h.list, v)

	idx := len(h.list) - 1
	for idx >= 0 {
		parentIdx := (idx - 1) / 2 // 부모 idx 구하기
		if parentIdx < 0 {
			break
		}
		if h.list[idx] < h.list[parentIdx] {
			// 부모노드보다 값이 작으면 부모노드와 자리를 바꾼다.
			h.list[idx], h.list[parentIdx] = h.list[parentIdx], h.list[idx]
			idx = parentIdx
		} else {
			break
		}
	}
}

func (h *MinHeap) Print() {
	fmt.Println(h.list)
}

func (h *MinHeap) Pop() int {
	if len(h.list) == 0 {
		return 0
	}

	top := h.list[0]
	last := h.list[len(h.list)-1]
	h.list = h.list[:len(h.list)-1]

	if len(h.list) == 0 {
		return top
	}

	h.list[0] = last
	idx := 0
	for idx < len(h.list) {
		swapIdx := -1
		leftIdx := idx*2 + 1
		// 자식 노드가 없는 경우
		if leftIdx >= len(h.list) {
			break
		}
		// 왼쪽 자식노드가 작은 경우
		if h.list[leftIdx] < h.list[idx] {
			swapIdx = leftIdx
		}

		rightIdx := idx*2 + 2
		// 오른쪽 자식노드가 존재하며, 부모노드와 왼쪽 자식노드보다 작은 경우
		if rightIdx < len(h.list) {
			if h.list[rightIdx] < h.list[idx] {
				if swapIdx >= 0 && h.list[swapIdx] > h.list[rightIdx] {
					swapIdx = rightIdx
				}
			}
		}

		if swapIdx < 0 {
			break
		}

		h.list[idx], h.list[swapIdx] = h.list[swapIdx], h.list[idx]
		idx = swapIdx
	}
	return top
}

func (h *MinHeap) Count() int {
	return len(h.list)
}
