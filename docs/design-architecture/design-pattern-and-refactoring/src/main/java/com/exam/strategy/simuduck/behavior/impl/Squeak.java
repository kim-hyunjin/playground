package com.exam.strategy.simuduck.behavior.impl;

import com.exam.strategy.simuduck.behavior.QuackBehavior;

public class Squeak implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("삑삑");
    }
}
