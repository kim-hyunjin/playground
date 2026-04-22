package hello.ooad.dogdoor;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class DogDoor {

	private boolean open;
	private List<Bark> allowedBark;
	
	public DogDoor() {
		this.open = false;
		this.allowedBark = new ArrayList<Bark>();
	}
	
	public void setAllowedBark(Bark bark) {
		this.allowedBark.add(bark);
	}
	
	public List<Bark> getAllowedBark() {
		return this.allowedBark;
	}
	
	public void open() {
		System.out.println("The dog door opens.");
		this.open = true;
		final Timer timer = new Timer();
		timer.schedule(new TimerTask() {
			public void run() {
				close();
				timer.cancel();
			}
		}, 5000);
	}
	
	public void close() {
		System.out.println("The dog door closes.");
		this.open = false;
	}
	
	public boolean isOpen() {
		return this.open;
	}
}
