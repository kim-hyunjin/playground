package section28testing

import (
	"fmt"
	"strings"
	"testing"
)

func TestGreet(t *testing.T) {
	benchmarkExam1()
	s := Greet("James")
	if s != "Hello, James" {
		t.Error("got", s, "expected", "Hello, James")
	}
}

func ExampleGreet() {
	fmt.Println(Greet("James"))
	// Output:
	// Hello, James
}

func BenchmarkGreet(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Greet("James")
	}
}

var s = "Shaken not stirred"
var xs = strings.Split(s, " ")
func BenchmarkCat(b *testing.B) {
	for i:= 0; i < b.N; i++ {
		Cat(xs)
	}
}

func BenchmarkJoin(b *testing.B) {
	for i:= 0; i < b.N; i++ {
		Join(xs)
	}
}

func ExampleCat() {
	fmt.Println(Cat(xs))
	// Output:
	// Shaken not stirred
}

func ExampleJoin() {
	fmt.Println(Join(xs))
	// Output:
	// Shaken not stirred
}