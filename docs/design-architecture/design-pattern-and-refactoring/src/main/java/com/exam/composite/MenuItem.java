package com.exam.composite;

import java.util.Iterator;

public class MenuItem extends MenuComponent{
    String name;
    String description;
    boolean vegetarian;
    int price;

    public MenuItem(String name, String description, boolean vegetarian, int price) {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public boolean isVegetarian() {
        return vegetarian;
    }

    @Override
    public int getPrice() {
        return price;
    }

    @Override
    public void print() {
        System.out.print("   " + getName());
        if (isVegetarian()) {
            System.out.print("(v)");
        }
        System.out.println(", " + getPrice() + "원");
        System.out.println("    -- " + getDescription());
    }
    @Override
    public Iterator createIterator() {
        return new NullIterator();
    }
}
