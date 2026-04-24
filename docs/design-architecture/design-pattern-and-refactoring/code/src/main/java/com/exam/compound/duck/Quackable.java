package com.exam.compound.duck;

import com.exam.compound.observer.QuackObservable;

public interface Quackable extends QuackObservable {
    void quack();
}
