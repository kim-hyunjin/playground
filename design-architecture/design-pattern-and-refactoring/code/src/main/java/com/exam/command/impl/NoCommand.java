package com.exam.command.impl;

import com.exam.command.Command;

/**
 * 아무것도 하지 않는 널객체
 */
public class NoCommand implements Command {
    @Override
    public void execute() {

    }

    @Override
    public void undo() {

    }
}
