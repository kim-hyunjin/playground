package com.exam.iterator;

public class MenuItem {
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

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public int getPrice() {
        return price;
    }
}
