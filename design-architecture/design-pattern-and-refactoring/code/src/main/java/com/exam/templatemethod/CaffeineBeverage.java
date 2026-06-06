package com.exam.templatemethod;

public abstract class CaffeineBeverage {

    // 카페인이 들어있는 음료를 만들기 위한 알고리즘에 대한 템플릿
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
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
