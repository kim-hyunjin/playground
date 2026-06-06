package section28testing

import "testing"

func TestMySum(t *testing.T) {
	if x := mySum(2, 3); x != 5 {
		t.Error("Expected,", 5, "Got", x)
	}
}

func TestMySum2(t *testing.T) {
	type test struct {
		data []int
		answer int
	}

	tests := []test{
		{[]int{21, 21}, 42},
		{[]int{21, 21}, 42},
		{[]int{21, 22}, 43},
		{[]int{-1, -2}, -3},
	}

	for _, tCase := range tests {
		got := mySum(tCase.data...)
		if tCase.answer != got {
			t.Error("Expected,", tCase.answer, "Got", got)
		}
	}
}