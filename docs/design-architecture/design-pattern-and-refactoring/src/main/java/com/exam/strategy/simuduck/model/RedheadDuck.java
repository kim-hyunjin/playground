package com.exam.strategy.simuduck.model;

import com.exam.strategy.simuduck.behavior.impl.FlyWithWings;
import com.exam.strategy.simuduck.behavior.impl.Quack;

public class RedheadDuck extends Duck{

    public RedheadDuck() {
        this.flyBehavior = new FlyWithWings();
        this.quackBehavior = new Quack();
    }

    @Override
    public void display() {
        System.out.println("나는 빨간오리");
    }
}
