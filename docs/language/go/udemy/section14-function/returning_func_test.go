package section14function

import (
	"fmt"
	"testing"
)

func TestReturningFunc(t *testing.T) {

	f := returnFunc()

	num := f()

	fmt.Printf("%T\n", f)
	fmt.Println(returnFunc()())

	if num != 451 {
		t.Error("not valid number")
	}
}