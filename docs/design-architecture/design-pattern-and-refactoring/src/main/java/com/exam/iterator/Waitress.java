package com.exam.iterator;

import java.util.ArrayList;
import java.util.Iterator;

public class Waitress {
    ArrayList menus;

    public Waitress(ArrayList menus) {
        this.menus = menus;
    }

    public void printMenu() {
        Iterator menuIterator = menus.iterator();
        while (menuIterator.hasNext()) {
            Menu menu = (Menu) menuIterator.next();
            if (menu instanceof PancakeHouseMenu) {
                System.out.println("\n팬케이크 메뉴");
            } else if (menu instanceof  DinerMenu) {
                System.out.println("\nDiner 메뉴");
            } else if (menu instanceof CafeMenu) {
                System.out.println("\nCafe 메뉴");
            }
            printMenu(menu.createIterator());
        }
    }

    private void printMenu(Iterator iterator) {
        while(iterator.hasNext()) {
            MenuItem menuItem = (MenuItem) iterator.next();
            System.out.println(menuItem.getName() + ", " + menuItem.price + "원");
            System.out.println("  " + menuItem.getDescription());
        }
    }
}
