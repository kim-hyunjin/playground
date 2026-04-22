package com.exam.strategy.simuduck.behavior.impl;

import com.exam.strategy.simuduck.behavior.FlyBehavior;

public class FlyWithWings implements FlyBehavior {

    @Override
    public void fry() {
        System.out.println("fly~~");
    }
}
