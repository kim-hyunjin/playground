package section14function

type person struct {
	first string
	last  string
}

func (p person) speak() string {
	return "I am " + p.first + " " + p.last
}

type secretAgent struct {
	person
	ltk bool
}

func (s secretAgent) speak() string {
	return "I am Agent " + s.last
}