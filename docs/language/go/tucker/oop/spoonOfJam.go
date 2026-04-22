package main

type SpoonOfJam interface {
	String() string
}

type SpoonOfStrawBerryJam struct {
}

func (s *SpoonOfStrawBerryJam) String() string {
	return " + strawberry"
}

type SpoonOfOrangeJam struct {
}

func (s *SpoonOfOrangeJam) String() string {
	return " + orange"
}

type SpoonOfAppleJam struct {
}

func (s *SpoonOfAppleJam) String() string {
	return " + apple"
}
