package com.exam.templatemethod;

public class BeverageTestDrive {
    public static void main(String[] args) {
        Tea tea = new Tea();
        CoffeeWithHook coffeeWithHook = new CoffeeWithHook();

        System.out.println("\n 차 준비중...");
        tea.prepareRecipe();

        System.out.println("\n 커피 준비중...");
        coffeeWithHook.prepareRecipe();
    }
}
