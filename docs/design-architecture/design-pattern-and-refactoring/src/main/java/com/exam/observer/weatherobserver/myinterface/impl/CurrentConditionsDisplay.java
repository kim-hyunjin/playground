package com.exam.observer.weatherobserver.myinterface.impl;

import com.exam.observer.weatherobserver.myinterface.DisplayElement;
import com.exam.observer.weatherobserver.myinterface.Observer;
import com.exam.observer.weatherobserver.myinterface.Subject;

public class CurrentConditionsDisplay implements Observer, DisplayElement {
    private float temperature;
    private float humidity;
    private Subject weatherData; // => 옵저버 목록에서 탈퇴할 때 유용하게 쓸 수 있음

    public CurrentConditionsDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    @Override
    public void display() {
        System.out.println("Current conditions: " + temperature + "C degrees and "
        + humidity + "% humidity");
    }

    @Override
    public void update(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        display();
    }
}
