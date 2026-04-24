package com.exam.decorator.starbuz.drink.condiment;

import com.exam.decorator.starbuz.drink.Beverage;

public class Mocha extends CondimentDecorator{
    Beverage beverage;

    public Mocha(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ", 모카";
    }

    @Override
    public double cost() {
        return 200 + beverage.cost();
    }


}
