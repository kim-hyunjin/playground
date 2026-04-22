package com.exam.templatemethod;

public abstract class CaffeineBeverageWithHook {

    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }

    boolean customerWantsCondiments() {
        return true;
    }

    public void boilWater() {
        System.out.println("물을 끓이는 중");
    }

    public void pourInCup() {
        System.out.println("컵에 따르는 중");
    }

    abstract void brew();
    abstract void addCondiments();
}
