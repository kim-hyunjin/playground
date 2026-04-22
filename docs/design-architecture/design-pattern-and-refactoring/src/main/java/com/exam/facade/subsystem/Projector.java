package com.exam.facade.subsystem;

public class Projector {
    private String mode;

    public void on() {
        System.out.println("프로젝터 전원 : ON");
    }

    public void off() {
        System.out.println("프로젝터 전원 : OFF");
    }

    public void wideScreenMode() {
        this.mode = "Wide Screen Mode";
        System.out.println("스크린 모드 : " + this.mode);
    }
}
