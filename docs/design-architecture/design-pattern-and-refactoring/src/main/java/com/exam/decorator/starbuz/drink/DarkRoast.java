package com.exam.decorator.starbuz.drink;

public class DarkRoast extends Beverage{
    public DarkRoast() {
        description = "다크 로스트";
    }

    @Override
    public double cost() {
        return 2100;
    }
}
