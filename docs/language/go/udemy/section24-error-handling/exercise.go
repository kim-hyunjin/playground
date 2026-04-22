package section24errorhandling

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
)

type person struct {
	First   string
	Last    string
	Sayings []string
}

type customErr struct {
	info string
}
func (c customErr) Error() string {
	return fmt.Sprintf("error! %v", c.info)
}

func exercise1() {
	p1 := person{
		First:   "James",
		Last:    "Bond",
		Sayings: []string{"asd", "Asd", "sdf"},
	}
	bs, err := json.Marshal(p1)
	if err != nil {
		log.Fatalln("JSON did not marshal", err)
	}
	fmt.Println(string(bs))
	bs, err = toJSON(p1)
	if err != nil {
		log.Fatalln("JSON did not marshal", err)
	}
	fmt.Println(string(bs))

	c1 := customErr{info: "need more coffee"}
	fmt.Printf("%T\n", c1)
	printErr(c1)
}

func toJSON(a interface{}) ([]byte, error) {
	bs, err := json.Marshal(a)
	if err != nil {
		return []byte{}, fmt.Errorf("JSON did not marshal %v", err)
	}
	return bs, nil;
}

func printErr(e error) {
	fmt.Println(e.(customErr).info) // assertion
}

type sqrtError struct {
	lat string
	long string
	err error
}

func (se sqrtError) Error() string {
	return fmt.Sprintf("math err : %v, %v, %v", se.lat, se.long, se.err)
}

func exercise2() {
	_, err := sqrt4(-10.23)
	if err != nil {
		log.Println(err)
	}
}

func sqrt4(f float64) (float64, error) {
	if f < 0 {
		e := errors.New("err")
		return 0, sqrtError{"50.12 N", "99.242 W", e}
	}
	return 42, nil
}