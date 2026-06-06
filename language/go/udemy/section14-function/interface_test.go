package section14function

import (
	"fmt"
	"testing"
)

func TestHuman(t *testing.T) {
	p := person{
		"hj",
		"kim",
	}

	s := humanSpeak(p)
	fmt.Println(s)
	if s != "I am hj kim" {
		t.Error("not valid human speak")
	}

	sa := secretAgent{
		person: person{
			"James",
		"Bond",
		},
		ltk: true,
	}

	s2 := humanSpeak(sa)
	fmt.Println(s2)
	if s2 != "I am Agent Bond" {
		t.Error("not valid human speak")
	}

}

func TestAssert(t *testing.T) {
	s1 := switchOnType(1)
	if s1 != "int" {
		t.Error("s1 is int not ", s1)
	}

	c := contact{
		"hello~",
		"kim",
	}
	s2 := switchOnType(c)
	if s2 != "contact" {
		t.Error("s1 is contact not ", s1)
	}
}