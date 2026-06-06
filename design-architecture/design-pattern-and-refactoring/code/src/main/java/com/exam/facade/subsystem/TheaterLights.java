package com.exam.facade.subsystem;

public class TheaterLights {
    private int dim;

    public void dim(int dim) {
        this.dim = dim;
        System.out.println("극장 밝기 : " + dim);
    }

    public void on() {
        System.out.println("극장 밝기 최대로!");
    }
}
