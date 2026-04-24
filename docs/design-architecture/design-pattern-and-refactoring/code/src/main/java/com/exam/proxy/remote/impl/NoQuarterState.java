package com.exam.proxy.remote.impl;

import com.exam.proxy.remote.GumballMachine;
import com.exam.proxy.remote.State;

public class NoQuarterState implements State {
    transient GumballMachine gumballMachine; // transient 로 선언하면 이 필드는 직렬화하지 않는다.

    public NoQuarterState(GumballMachine gumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    @Override
    public void insertQuarter() {
        System.out.println("동전을 넣으셨습니다.");
        gumballMachine.setState(gumballMachine.getHasQuarterState());
    }

    @Override
    public void ejectQuarter() {
        System.out.println("동전을 넣어주세요.");
    }

    @Override
    public void turnCrank() {
        System.out.println("동전을 넣어주세요.");
    }

    @Override
    public void dispense() {
        System.out.println("동전을 넣어주세요.");
    }

    @Override
    public String toString() {
        return "동전 투입 대기중...";
    }
}
