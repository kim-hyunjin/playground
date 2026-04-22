package com.exam.factory.pizzashop;

import com.exam.factory.pizzashop.pizza.Pizza;
import com.exam.factory.pizzashop.pizzastore.ChicagoPizzaStore;
import com.exam.factory.pizzashop.pizzastore.NYPizzaStore;
import com.exam.factory.pizzashop.pizzastore.PizzaStore;

public class PizzaTestDrive {
    public static void main(String[] args) {
        PizzaStore nyStore = new NYPizzaStore();
        PizzaStore chicagoStore = new ChicagoPizzaStore();

        Pizza pizza = nyStore.orderPizza("cheese");
        System.out.println("Ethan ordered a " + pizza.getName() + "\n");

        pizza = chicagoStore.orderPizza("cheese");
        System.out.println("Joel ordered a " + pizza.getName() + "\n");
    }
}
