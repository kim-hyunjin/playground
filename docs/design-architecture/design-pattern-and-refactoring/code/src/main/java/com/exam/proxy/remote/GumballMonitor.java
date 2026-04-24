package com.exam.proxy.remote;

import java.rmi.RemoteException;

public class GumballMonitor {
    GumballMachineRemote gumballMachine;

    public GumballMonitor(GumballMachineRemote gumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    public void report() {
        try {
            System.out.println("뽑기 기계 위치: " + gumballMachine.getLocation());
            System.out.println("현재 재고: " + gumballMachine.getCount() + " 개");
            System.out.println("현재 상태: " + gumballMachine.getState());
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
