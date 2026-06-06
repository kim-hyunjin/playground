package banking

import (
	"errors"
	"fmt"
)

type account struct {
	owner string
	balance int
}

var errNoMoney = errors.New("Not enough balance")

// Create New Account
func NewAccount(owner string) *account {
	account := account{owner: owner, balance: 0}
	return &account
}

// Deposit x amount on your account
func (a *account) Deposit(amount int) { // pointer receiver
	a.balance += amount
}

// Balance of your account
func (a account) Balance() int { // receiver
	return a.balance
}

// Withdraw x amount from your account
func (a *account) Withdraw(amount int) error {
	if a.balance < amount {
		return errNoMoney
	}
	a.balance -= amount
	return nil
}

// Change Owner of the account
func (a *account) ChangeOwner(newOnwer string) {
	a.owner = newOnwer
}

// Owner of the account
func (a account) Owner() string {
	return a.owner
}

func (a account) String() string { // struct를 출력할때 go가 자동으로 실행하는 메소드 : String()
	return fmt.Sprint(a.owner, "'s account.\n Balance: ", a.balance)
}