package com.exam.strategy.simuduck.behavior.impl;

import com.exam.strategy.simuduck.behavior.QuackBehavior;

public class MuteQuack implements QuackBehavior {

    @Override
    public void quack() {
        System.out.println("<<조용>>");
    }
}
