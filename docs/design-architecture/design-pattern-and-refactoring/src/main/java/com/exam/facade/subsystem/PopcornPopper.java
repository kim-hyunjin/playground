package com.exam.facade.subsystem;

public class PopcornPopper {
    public void on() {
        System.out.println("팝콘기계 전원 : ON");
    }

    public void pop() {
        System.out.println("팝콘 튀기기 시작...");
    }

    public void off() {
        System.out.println("팝콘기계 전원 : OFF");
    }
}
