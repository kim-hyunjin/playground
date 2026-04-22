package hello.ooad.dogdoor;

public class BarkRecognizer {
	private DogDoor door;
	
	public BarkRecognizer(DogDoor door) {
		this.door = door;
	}
	
	public void recognize(Bark bark) {
		System.out.println("BarkRecognizer: Heard a '" + bark.getSound() + "'");
		if(door.getAllowedBark().stream()
			.anyMatch(allowedBark -> allowedBark.getSound().equals(bark.getSound()))) {
			door.open();
		} else {
			System.out.println("This dog is not allowed");
		}

	}
}
