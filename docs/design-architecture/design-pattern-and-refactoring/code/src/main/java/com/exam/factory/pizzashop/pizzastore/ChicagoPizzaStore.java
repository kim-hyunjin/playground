package com.exam.factory.pizzashop.pizzastore;

import com.exam.factory.pizzashop.ingredient.PizzaIngredientFactory;
import com.exam.factory.pizzashop.ingredient.impl.ChicagoPizzaIngredientFactory;
import com.exam.factory.pizzashop.pizza.*;

public class ChicagoPizzaStore extends PizzaStore{
    @Override
    Pizza createPizza(String type) {
        Pizza pizza = null;
        PizzaIngredientFactory ingredientFactory = new ChicagoPizzaIngredientFactory();

        switch (type) {
            case "cheese":
                pizza = new CheesePizza(ingredientFactory);
                pizza.setName("Chicago Style Cheese Pizza");
                return pizza;
            case "veggie":
                pizza = new VeggiePizza(ingredientFactory);
                pizza.setName("Chicago Style Veggie Pizza");
                return pizza;
            case "clam":
                pizza = new ClamPizza(ingredientFactory);
                pizza.setName("Chicago Style Clam Pizza");
                return pizza;
            case "pepperoni":
                pizza = new PepperoniPizza(ingredientFactory);
                pizza.setName("Chicago Style Pepperoni Pizza");
                return pizza;
            default: return pizza;
        }
    }
}
