package com.exam.decorator.starbuz;

import com.exam.decorator.starbuz.drink.Beverage;
import com.exam.decorator.starbuz.drink.DarkRoast;
import com.exam.decorator.starbuz.drink.Espresso;
import com.exam.decorator.starbuz.drink.HouseBlend;
import com.exam.decorator.starbuz.drink.condiment.Mocha;
import com.exam.decorator.starbuz.drink.condiment.Soy;
import com.exam.decorator.starbuz.drink.condiment.Whip;

public class StarbuzCoffee {
    public static void main(String args[]) {
        Beverage beverage = new Espresso();
        System.out.println(beverage.getDescription() + "\n 금액: "
            + beverage.cost() + "원"
        );

        Beverage beverage2 = new DarkRoast();
        beverage2 = new Mocha(beverage2);
        beverage2 = new Mocha(beverage2);
        beverage2 = new Whip(beverage2);
        System.out.println(beverage2.getDescription() + "\n 금액: "
                + beverage2.cost() + "원"
        );

        Beverage beverage3 = new HouseBlend();
        beverage3 = new Soy(beverage3);
        beverage3 = new Mocha(beverage3);
        beverage3 = new Whip(beverage3);
        System.out.println(beverage3.getDescription() + "\n 금액: "
                + beverage3.cost() + "원"
        );
    }
}
