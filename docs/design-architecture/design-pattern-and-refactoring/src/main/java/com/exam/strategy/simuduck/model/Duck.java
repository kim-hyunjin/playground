package com.exam.strategy.simuduck.model;

import com.exam.strategy.simuduck.behavior.FlyBehavior;
import com.exam.strategy.simuduck.behavior.QuackBehavior;

public abstract class Duck {

    protected FlyBehavior flyBehavior;
    protected QuackBehavior quackBehavior;

    public void quack() {
        quackBehavior.quack();
    }

    public void swim() {

    }

    public void fly() {
        flyBehavior.fry();
    }

    public abstract void display();

    public void setFlyBehavior(FlyBehavior flyBehavior) {
        this.flyBehavior = flyBehavior;
    }

    public void setQuackBehavior(QuackBehavior quackBehavior) {
        this.quackBehavior = quackBehavior;
    }
}
