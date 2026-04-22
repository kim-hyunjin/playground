package com.exam.compound.observer;

public interface QuackObservable {
    void registerObserver(Observer observer);
    void notifyObservers();
}
