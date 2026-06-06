package com.exam.command.impl;

import com.exam.command.Command;
import com.exam.command.receiver.GarageDoor;

public class GarageDoorOpenCommand implements Command {
    private GarageDoor garageDoor;

    public GarageDoorOpenCommand(GarageDoor garageDoor) {
        this.garageDoor = garageDoor;
    }

    @Override
    public void execute() {
        garageDoor.open();
    }

    @Override
    public void undo() {
        garageDoor.close();
    }
}
