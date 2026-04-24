package com.exam.observer.weatherobserver.myinterface;

public interface Observer {
    void update(float temperature, float humidity, float pressure);
}
