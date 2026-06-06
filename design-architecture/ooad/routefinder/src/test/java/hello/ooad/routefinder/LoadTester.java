package hello.ooad.routefinder;

import hello.ooad.routefinder.loader.SubwayLoader;
import hello.ooad.routefinder.subway.Subway;

import java.io.File;

public class LoadTester {
    public static void main(String[] args) {
        try {
            SubwayLoader loader = new SubwayLoader();
            String fileName = LoadTester.class.getClassLoader().getResource("Subway.txt").getFile();
            if (fileName == null || fileName.equals("")) {
                System.out.println("\n파일이 존재하지 않습니다.");
                System.exit(-1);
            }
            Subway seoulSubway = loader.loadFromFile(new File(fileName));
            System.out.println("\nTesting stations...");
            if (seoulSubway.hasStation("신림") &&
                seoulSubway.hasStation("봉천") &&
                seoulSubway.hasStation("서울대입구")
                ) {
                System.out.println("station test passed successfully");
            } else {
                System.out.println("station test FAILED.");
                System.exit(-1);
            }

            System.out.println("\nTesting connections...");
            if (seoulSubway.hasConnection("신림", "봉천", "2호선") &&
                seoulSubway.hasConnection("신대방", "영등포", "1호선") &&
                seoulSubway.hasConnection("대방", "노량진", "1호선")
                ) {
                System.out.println("connections test passed successfully.");
            } else {
                System.out.println("connections test FAILED.");
                System.exit(-1);
            }
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}
