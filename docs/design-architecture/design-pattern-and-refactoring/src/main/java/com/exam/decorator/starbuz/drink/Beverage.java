package com.exam.decorator.starbuz.drink;

public abstract class Beverage {
    public enum Size { TALL, GRANDE, VENTI };
    protected String description;
    protected Size size;

    public String getDescription() {
        return description;
    }

    public Size getSize() {
        return size;
    }

    public abstract double cost();
}
