package com.exam.decorator.starbuz.drink;

public class Espresso extends Beverage{

    public Espresso() {
        this.description = "에스프레소";
    }
    @Override
    public double cost() {
        return 1500;
    }
}
