package section14function

import (
	"fmt"
	"testing"
)

func TestGreeting(t *testing.T) {
	names := []string{"kim", "lee", "cho"}
	s := greeting("Hello: ", names...)
	fmt.Println(s)

	if s != "Hello: kim, lee, cho" {
		t.Error("not valid greeting")
	}
}