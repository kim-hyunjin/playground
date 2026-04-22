package hello.ooad.dogdoor;

public class DogDoorSimulator {

	public static void main(String[] args) {
		DogDoor door = new DogDoor();
		Bark bark1 = new Bark("왈왈");
		Bark bark2 = new Bark("멍멍");
		door.setAllowedBark(bark1);
		door.setAllowedBark(bark2);
		BarkRecognizer recognizer = new BarkRecognizer(door);
		
		System.out.println("흰둥이가 밖으로 나가고 싶어 짖는다");
		
		recognizer.recognize(bark2);
		System.out.println("흰둥이가 밖으로 나갔다");
		System.out.println("흰둥이가 볼일을 본다");
		try {
			Thread.sleep(6000);
		} catch (InterruptedException e) {
		}
		System.out.println("흰둥이가 밖에서 들어오지 못함");
		System.out.println("흰둥이가 짖기 시작한다.");
		recognizer.recognize(bark1);
		System.out.println("흰둥이가 안으로 들어온다.");
	}

}
