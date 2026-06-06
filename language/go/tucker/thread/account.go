package thread

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Account struct {
	balance int
	mutex   *sync.Mutex
}

func (a *Account) Widthdraw(val int) {
	a.mutex.Lock()
	a.balance -= val
	a.mutex.Unlock()
}

func (a *Account) Deposit(val int) {
	a.mutex.Lock()
	a.balance += val
	a.mutex.Unlock()
}

func (a *Account) Balance() int {
	a.mutex.Lock()
	balance := a.balance
	a.mutex.Unlock()
	return balance
}

var accounts []*Account // 전역 변수
var globalLock *sync.Mutex

func Transfer(sender, receiver int, money int) {
	globalLock.Lock()
	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)
	globalLock.Unlock()
	fmt.Println("Transfer", sender, receiver, money)
}

func DeadLockTransfer(sender, receiver int, money int) {
	// 아래와 같이 락을 잡으면 데드락에 빠지므로, 락을 잡을 때 작게 잡거나 크게 잡아야한다.
	accounts[sender].mutex.Lock()
	fmt.Println("lock", sender)
	accounts[receiver].mutex.Lock()
	fmt.Println("lock", receiver)

	accounts[sender].Widthdraw(money)
	accounts[receiver].Deposit(money)

	accounts[receiver].mutex.Unlock()
	accounts[sender].mutex.Unlock()
	fmt.Println("Transfer", sender, receiver, money)
}

func GetTotalBalance() int {
	globalLock.Lock()
	var total int
	for i := 0; i < len(accounts); i++ {
		total += accounts[i].Balance()
	}
	globalLock.Unlock()
	return total
}

func RandomTransfer() {
	var sender, balance int
	for {
		sender = rand.Intn(len(accounts))
		balance = accounts[sender].Balance()
		if balance > 0 {
			break
		}
	}

	var receiver int
	for {
		receiver = rand.Intn(len(accounts))
		if sender != receiver {
			break
		}
	}

	money := rand.Intn(balance)
	Transfer(sender, receiver, money)
}

func GoTransfer() {
	for {
		RandomTransfer()
	}
}

func PrintTotalBalance() {
	fmt.Printf("Total: %d\n", GetTotalBalance())
}

/*
  10개의 go 쓰레드가 같은 메모리에 동시 접근
*/
func AccountTest() {
	for i := 0; i < 20; i++ {
		accounts = append(accounts, &Account{balance: 1000, mutex: &sync.Mutex{}})
	}
	globalLock = &sync.Mutex{}

	PrintTotalBalance()

	for i := 0; i < 10; i++ {
		go GoTransfer()
	}

	for {
		PrintTotalBalance()
		time.Sleep(100 * time.Millisecond)
	}
}

/*
쓰레드1 lock 0, lock 1
쓰레드2 lock 1, lock 0

쓰레드1은 0을 잠그고 1을 잠그려고 하는데 1이 이미 다른 쓰레드로 인해 잠겨 있어서 lock이 풀릴때까지 대기한다.
반대로 쓰레드2는 1을 잠그고 0을 잠그기 위해 0이 lock이 풀릴때까지 대기한다.
쓰레드 1이 필요한 자원을 쓰레드 2가,
쓰레드 2가 필요한 자원을 쓰레드 1이 잠그고 있어 서로 교착상태에 빠짐. ==> 데드락
*/
func DeadLockTest() {
	for i := 0; i < 20; i++ {
		accounts = append(accounts, &Account{balance: 1000, mutex: &sync.Mutex{}})
	}
	globalLock = &sync.Mutex{}

	go func() {
		for {
			DeadLockTransfer(0, 1, 100)
			// Transfer(0, 1, 100)
		}
	}()

	go func() {
		for {
			DeadLockTransfer(1, 0, 100)
			// Transfer(1, 0, 100)
		}
	}()

	for {
		time.Sleep(100 * time.Millisecond)
	}

}
