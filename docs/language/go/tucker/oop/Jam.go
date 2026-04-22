package main

type Jam interface {
	GetOneSpoon() SpoonOfJam
}

type StrawberryJam struct {
}

func (j *StrawberryJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfStrawBerryJam{}
}

type OrangeJam struct {
}

func (o *OrangeJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfOrangeJam{}
}

type AppleJam struct {
}

func (a *AppleJam) GetOneSpoon() SpoonOfJam {
	return &SpoonOfAppleJam{}
}
