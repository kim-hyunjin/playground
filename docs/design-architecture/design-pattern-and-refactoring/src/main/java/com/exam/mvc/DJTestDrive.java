package com.exam.mvc;

import com.exam.mvc.controller.BeatController;
import com.exam.mvc.controller.ControllerInterface;
import com.exam.mvc.model.BeatModel;
import com.exam.mvc.model.BeatModelInterface;

public class DJTestDrive {
    public static void main(String[] args) {
        BeatModelInterface model = new BeatModel();
        ControllerInterface controller = new BeatController(model);
    }
}
