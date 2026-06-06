package com.exam.mvc.controller;

import com.exam.mvc.model.HeartAdapter;
import com.exam.mvc.model.HeartModelInterface;
import com.exam.mvc.view.DJView;

public class HeartController implements ControllerInterface {
	HeartModelInterface model;
	DJView view;
  
	public HeartController(HeartModelInterface model) {
		this.model = model;
		view = new DJView(new HeartAdapter(model),this);
        view.createView();
        view.createControls();
		view.disableStopMenuItem();
		view.disableStartMenuItem();
	}
  
	public void start() {}
 
	public void stop() {}
    
	public void increaseBPM() {}
    
	public void decreaseBPM() {}
  
 	public void setBPM(int bpm) {}
}



