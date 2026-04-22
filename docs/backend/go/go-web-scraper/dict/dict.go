package dict

import (
	"errors"
	"fmt"

	"github.com/kim-hyunjin/go-scraper/banking"
)

type Dictionary map[string]string

var (
	errNotFound = errors.New("Not found")
	errWordExists = errors.New("That word already exists")
	errCantUpdate = errors.New("Can't update non-existing word")
)

// Search for a word
func (d Dictionary) Search(word string) (string, error) {
	value, exists := d[word]
	if exists {
		return value, nil
	}
	return "", errNotFound
}

// Add a word to dictionary
func (d Dictionary) Add(word, definition string) error { // map is a hashmap in go. by default a hashmap use pointer. so we don't need to use *
	_, err := d.Search(word)
	switch err {
	case errNotFound:
		d[word] = definition
	case nil:
		return errWordExists
	}
	return nil
}

// Update a word in dictionary
func (d Dictionary) Update(word, definition string) error {
	_, err := d.Search(word)
	switch err {
	case nil:
		d[word] = definition
	case errNotFound:
		return errCantUpdate
	}
	return nil
}

// Delete a word in dictionary
func (d Dictionary) Delete(word string) {
	delete(d, word)
}

func exam() {
	account := banking.NewAccount("hyunjin")
	account.Deposit(5000)
	fmt.Println(account.Owner(), account.Balance())
	account.Withdraw(3000)
	account.ChangeOwner("gildong")
	fmt.Println(account.Owner(), account.Balance())
	fmt.Println(account)
	// err := account.Withdraw(3000)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	dictionary := Dictionary{"first": "First word"}
	dictionary["hello"] = "hello"
	definition, err := dictionary.Search("first")
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(definition)
	}

	err = dictionary.Add("hello2", "greeting")
	if err != nil {
		fmt.Println(err)
	}
	definition, err = dictionary.Search("hello2")
	fmt.Println(definition)

	err = dictionary.Update("hello2", "Hola!")
	if err != nil {
		fmt.Println(err)
	}
	definition, _ = dictionary.Search("hello2")
	fmt.Println(definition)

	dictionary.Delete("hello2")

	err = dictionary.Update("hello2", "howdy!")
	if err != nil {
		fmt.Println(err)
	}
}