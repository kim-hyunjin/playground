package com.exam.decorator.starbuz.drink.condiment;

import com.exam.decorator.starbuz.drink.Beverage;

public class SteamMilk extends CondimentDecorator{
    Beverage beverage;

    public SteamMilk(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public double cost() {
        return 600 + beverage.cost();
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ", 스팀 밀크";
    }
}
