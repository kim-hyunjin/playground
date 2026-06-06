package section14function

import "fmt"

type human interface {
	speak() string
}

func humanSpeak(h human) string {
	return h.speak()
}

type contact struct {
	greeting string
	name     string
}

// every type implements empty interface
func switchOnType(x interface{}) string {
	switch x.(type) { // this is an assert; asserting, "x is of this type"
	case int:
		fmt.Println("int")
		return "int"
	case string:
		fmt.Println("string")
		return "string"
	case contact:
		fmt.Println("contact", x.(contact).greeting) // asserting
		return "contact"
	default:
		fmt.Println("unknown")
		return "unknown"
	}
}