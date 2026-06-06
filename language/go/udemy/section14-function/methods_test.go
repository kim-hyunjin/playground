package section14function

import (
	"fmt"
	"testing"
)

func TestSpeak(t *testing.T) {
	sa1 := secretAgent{
		person: person{
			"James",
			"Bond",
		},
		ltk: true,
	}

	fmt.Println(sa1)
	s := sa1.speak()
	if s != "I am Agent Bond" {
		t.Error("not valid speak")
	}
}