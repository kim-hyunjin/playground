package section24errorhandling

import (
	"errors"
	"fmt"
	"log"
	"math"
)

// ErrNorgateMath square root of negative number
var ErrNorgateMath = errors.New("norgate math: square root of negative number")

func withInfoExam() {
	fmt.Printf("%T\n", ErrNorgateMath) // *errors.errorString
	_, err := sqrt(-10)
	if err != nil {
		log.Fatalln(err)
	}
}

func sqrt(f float64) (float64, error) {
	if f < 0 {
		return 0, ErrNorgateMath
	}
	return math.Sqrt(f), nil
}

func withInfoExam2() {
	_, err := sqrt2(-10)
	if err != nil {
		log.Fatalln(err)
	}
}

func sqrt2(f float64) (float64, error) {
	if f < 0 {
		return 0, fmt.Errorf("norgate math: square root of negative number: %v", f)
	}
	return math.Sqrt(f), nil
}

// MyError just simple custom error exam
type MyError struct {
	msg string
}

func (m MyError) Error() string {
	return fmt.Sprintf("my error: %s", m.msg)
}

func withInfoExam3() {
	_, err := sqrt3(-10)
	if err != nil {
		fmt.Printf("%T\n", err) // section24errorhandling.MyError
		log.Fatalln(err)
	}
}

func sqrt3(f float64) (float64, error) {
	if f < 0 {
		return 0, MyError{"norgate math: square root of negative number"}
	}
	return math.Sqrt(f), nil
}