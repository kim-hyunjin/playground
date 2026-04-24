package com.exam.facade.subsystem;

public class DvdPlayer {
    public void play(String movie) {
        System.out.println("DVD Player : 영화 재생!\n 영화제목 : <<" + movie + ">>" );
    }

    public void on() {
        System.out.println("DVD Player 전원 : ON");
    }

    public void stop() {
        System.out.println("DVD Player : 재생 중단");
    }

    public void eject() {
        System.out.println("DVD Player : DVD Eject!");
    }

    public void off() {
        System.out.println("DVD Player 전원 : OFF");
    }
}
