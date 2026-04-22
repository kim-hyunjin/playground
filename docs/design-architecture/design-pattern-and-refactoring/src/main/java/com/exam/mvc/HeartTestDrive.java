package com.exam.mvc;

import com.exam.mvc.controller.ControllerInterface;
import com.exam.mvc.controller.HeartController;
import com.exam.mvc.model.HeartModel;

public class HeartTestDrive {

    public static void main (String[] args) {
		HeartModel heartModel = new HeartModel();
        ControllerInterface model = new HeartController(heartModel);
    }
}
