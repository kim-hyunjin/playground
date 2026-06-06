package section14function

import "testing"

func TestRecursion(t *testing.T) {
	recursionExam()

	n := factorial(4)
	if n != 24 {
		t.Error("not valid answer")
	}
}