package com.exam.command.client;

import com.exam.command.Command;
import com.exam.command.receiver.CeilingFan;
import com.exam.command.receiver.Light;
import com.exam.command.invoker.RemoteControlWithUndo;
import com.exam.command.impl.*;

public class RemoteLoader {
    public static void main(String[] args) {
//        RemoteControl remoteControl = new RemoteControl();
        RemoteControlWithUndo remoteControl = new RemoteControlWithUndo();

        Light livingRoomLight = new Light() {
            @Override
            public void on() {
                System.out.println("거실 불 켜기");
            }

            @Override
            public void off() {
                System.out.println("거실 불 끄기");
            }
        };

        Light kitchenLight = new Light() {
            @Override
            public void on() {
                System.out.println("부엌 불 켜기");
            }

            @Override
            public void off() {
                System.out.println("부엌 불 끄기");
            }
        };

        LightOnCommand livingRoomLightOn = new LightOnCommand(livingRoomLight);
        LightOffCommand livingRoomLightOff = new LightOffCommand(livingRoomLight);
        LightOnCommand kitchenLightOn = new LightOnCommand(kitchenLight);
        LightOffCommand kitchenLightOff = new LightOffCommand(kitchenLight);

        remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
        remoteControl.setCommand(1, kitchenLightOn, kitchenLightOff);

        System.out.println(remoteControl);
        remoteControl.onButtonWasPushed(0);
        remoteControl.offButtonWasPushed(0);
        remoteControl.undoButtonWasPushed();
        remoteControl.onButtonWasPushed(1);
        remoteControl.offButtonWasPushed(1);
        remoteControl.undoButtonWasPushed();

        CeilingFan ceilingFan = new CeilingFan("Living Room");

        CeilingFanHighCommand ceilingFanHigh = new CeilingFanHighCommand(ceilingFan);
        CeilingFanMediumCommand ceilingFanMedium = new CeilingFanMediumCommand(ceilingFan);
        CeilingFanOffCommand ceilingFanOff = new CeilingFanOffCommand(ceilingFan);

        remoteControl.setCommand(2, ceilingFanHigh, ceilingFanOff);
        remoteControl.setCommand(3, ceilingFanMedium, ceilingFanOff);

        System.out.println(remoteControl);
        remoteControl.onButtonWasPushed(2);
        remoteControl.offButtonWasPushed(2);
        remoteControl.undoButtonWasPushed();
        remoteControl.onButtonWasPushed(3);
        remoteControl.offButtonWasPushed(3);
        remoteControl.undoButtonWasPushed();

        Command[] partyOn = {livingRoomLightOn, kitchenLightOn, ceilingFanHigh};
        Command[] partyOff = {livingRoomLightOff, kitchenLightOff, ceilingFanOff};

        MacroCommand partyOnMacro = new MacroCommand(partyOn);
        MacroCommand partyOffMacro = new MacroCommand(partyOff);

        remoteControl.setCommand(4, partyOnMacro, partyOffMacro);

        System.out.println(remoteControl);
        System.out.println(" --- Pushing Macro On ---");
        remoteControl.onButtonWasPushed(4);
        System.out.println(" --- Pushing Macro Off ---");
        remoteControl.offButtonWasPushed(4);

    }
}
