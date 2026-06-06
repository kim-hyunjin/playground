package com.exam.command.client;

import com.exam.command.receiver.GarageDoor;
import com.exam.command.receiver.Light;
import com.exam.command.invoker.SimpleRemoteControl;
import com.exam.command.impl.GarageDoorOpenCommand;
import com.exam.command.impl.LightOnCommand;

public class RemoteControlTest { // 클라이언트
    public static void main(String[] args) {
        SimpleRemoteControl remote = new SimpleRemoteControl(); // remote  변수가 invoker 역할을 수행. 필요한 작업을 요청할 때 사용할 커맨드 객체를 인자로 전달받음.
        Light light = new Light() {
            @Override
            public void on() {
                System.out.println("불켜기");
            }

            @Override
            public void off() {
                System.out.println("불끄기");
            }
        };

        GarageDoor garageDoor = new GarageDoor() {
            @Override
            public void open() {
                System.out.println("차고 문열기");
            }

            @Override
            public void close() {
                System.out.println("차고 문닫기");
            }
        };

        // 커맨드 객체 생성
        LightOnCommand lightOn = new LightOnCommand(light);
        GarageDoorOpenCommand doorOpen = new GarageDoorOpenCommand(garageDoor);

        // 인보커한테 전달
        remote.setCommand(lightOn);
        remote.buttonWasPressed();
        remote.setCommand(doorOpen);
        remote.buttonWasPressed();
    }
}
