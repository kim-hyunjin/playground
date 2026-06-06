package com.exam.command.receiver;

public class CeilingFan {
    public static final int HIGH = 3;
    public static final int MEDIUM = 2;
    public static final int LOW = 1;
    public static final int OFF = 0;
    String location;
    int speed;

    public CeilingFan(String location) {
        this.location = location;
        speed = OFF;
    }

    public void high() {
        speed = HIGH;
        System.out.println("팬속도: high");
    }

    public void medium() {
        speed = MEDIUM;
        System.out.println("팬속도: medium");
    }

    public void low() {
        speed = LOW;
        System.out.println("팬속도: low");
    }

    public void off() {
        speed = OFF;
        System.out.println("팬 off");
    }

    public int getSpeed() {
        return speed;
    }
}
