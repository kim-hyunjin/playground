package com.exam.strategy.simuduck;

import com.exam.strategy.simuduck.behavior.impl.FlyRocketPowered;
import com.exam.strategy.simuduck.model.Duck;
import com.exam.strategy.simuduck.model.ModelDuck;

public class MiniDuckSimulator {
    public static void main(String[] args) {
        Duck duck = new ModelDuck();
        duck.fly();
        duck.setFlyBehavior(new FlyRocketPowered());
        duck.fly();
    }
}
