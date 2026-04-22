package com.exam.command.invoker;

import com.exam.command.Command;
import com.exam.command.impl.NoCommand;

public class RemoteControlWithUndo{
    Command[] onCommands;
    Command[] offCommands;
    Command undoCommand;

    public RemoteControlWithUndo() {
        int commandLength = 7;
        onCommands = new Command[commandLength];
        offCommands = new Command[commandLength];

        // 기본 커맨드 객체(아무일도 하지 않는 객체임)로 초기화시켜두면 슬롯마다 널 체크를 하지 않아도 됨
        Command noCommand = new NoCommand();
        for (int i = 0; i < commandLength; i++) {
            onCommands[i] = noCommand;
            offCommands[i] = noCommand;
        }
        undoCommand = noCommand;
    }

    public void setCommand(int slot, Command onCommand, Command offCommand) {
        onCommands[slot] = onCommand;
        offCommands[slot] = offCommand;
    }

    public void onButtonWasPushed(int slot) {
        onCommands[slot].execute();
        undoCommand = onCommands[slot];
    }

    public void offButtonWasPushed(int slot) {
        offCommands[slot].execute();
        undoCommand = offCommands[slot];
    }

    public void undoButtonWasPushed() {
        undoCommand.undo();
    }

    public String toString() {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("\n ----- Remote Control -----\n");
        for (int i = 0; i < onCommands.length; i++) {
            stringBuffer.append("[slot " + i + "]" + onCommands[i].getClass().getName() + "    " + offCommands[i].getClass().getName() + "\n");
        }
        return stringBuffer.toString();
    }
}
