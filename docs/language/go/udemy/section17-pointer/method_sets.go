package section17pointer

import (
	"fmt"
	"math"
)

type shape interface {
	area() float64
}

type circle struct {
	radius float64
}

func (c circle) area() float64 {
	return math.Pi * c.radius * c.radius
}

type rectangle struct {
	width float64
}

func (r *rectangle) area() float64 {
	return r.width * r.width
}

func info(s shape) {
	fmt.Println("area ", s.area())
}