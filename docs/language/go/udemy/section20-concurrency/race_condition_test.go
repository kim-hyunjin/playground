package section20concurrency

import "testing"

func TestRaceCondition(t *testing.T) {
	raceConditionExam()
}

func TestMutexExam(t *testing.T) {
	mutexExam()
}

func TestAtomic(t *testing.T) {
	atomicExam()
}