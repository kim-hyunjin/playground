package com.exam.factory.pizzashop.pizzastore;

import com.exam.factory.pizzashop.pizza.Pizza;

public abstract class PizzaStore {
//    SimplePizzaFactory factory;
//
//    public PizzaStore(SimplePizzaFactory factory) {
//        this.factory = factory;
//    }

    public Pizza orderPizza(String type) {
        Pizza pizza;

        pizza = createPizza(type);

        pizza.prepare();

        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }

    abstract Pizza createPizza(String type);
}
