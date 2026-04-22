package com.exam.facade.subsystem;

public class Amplifier {
    private DvdPlayer dvd;
    private String sound;
    private int volume;

    public void on() {
        System.out.println("앰프 전원 : ON");
    }

    public void off() {
        System.out.println("앰프 전원 : OFF");
    }

    public void setDvd(DvdPlayer dvd) {
        this.dvd = dvd;
    }

    public void setSurroundSound() {
        this.sound = "Surround Sound";
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }
}
