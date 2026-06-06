package com.exam.decorator.starbuz.drink.condiment;

import com.exam.decorator.starbuz.drink.Beverage;

public class Soy extends CondimentDecorator{
    Beverage beverage;

    public Soy(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public double cost() {
        double cost = beverage.cost();
        if (getSize() == Size.TALL) {
            cost += 500;
        } else if (getSize() == Size.GRANDE) {
            cost += 700;
        } else if (getSize() == Size.VENTI) {
            cost += 800;
        }
        return cost;
    }

    @Override
    public Beverage.Size getSize() {
        return beverage.getSize();
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ", 두유";
    }
}
