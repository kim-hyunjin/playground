package programmers.algorithm.level1;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.function.BiConsumer;

public class GymSuit {
  //  점심시간에 도둑이 들어, 일부 학생이 체육복을 도난당했습니다.
  //  다행히 여벌 체육복이 있는 학생이 이들에게 체육복을 빌려주려 합니다.
  //  학생들의 번호는 체격 순으로 매겨져 있어,
  //  바로 앞번호의 학생이나 바로 뒷번호의 학생에게만 체육복을 빌려줄 수 있습니다.
  //  예를 들어, 4번 학생은 3번 학생이나 5번 학생에게만 체육복을 빌려줄 수 있습니다.
  //  체육복이 없으면 수업을 들을 수 없기 때문에 체육복을 적절히 빌려 최대한 많은 학생이 체육수업을 들어야 합니다.
  //
  //  전체 학생의 수 n, 체육복을 도난당한 학생들의 번호가 담긴 배열 lost,
  //  여벌의 체육복을 가져온 학생들의 번호가 담긴 배열 reserve가 매개변수로 주어질 때,
  //  체육수업을 들을 수 있는 학생의 최댓값을 return 하도록 solution 함수를 작성해주세요.
  //
  //  제한사항
  //  전체 학생의 수는 2명 이상 30명 이하입니다.
  //  체육복을 도난당한 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
  //  여벌의 체육복을 가져온 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
  //  여벌 체육복이 있는 학생만 다른 학생에게 체육복을 빌려줄 수 있습니다.
  //  여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있습니다.
  //  이때 이 학생은 체육복을 하나만 도난당했다고 가정하며,
  //  남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없습니다.
  public static void main(String[] args) {
    int[] lost = {2, 4};
    int[] reserve = {3};

    System.out.println(solution(5, lost, reserve));

  }
  public static int solution(int n, int[] lost, int[] reserve) {
    int answer = n;
    HashSet<Integer> reserveSet = new HashSet<>();
    HashSet<Integer> lostSet = new HashSet<>();

    for(int i : reserve) { // 여벌 체육복을 가진 학생들을 집합으로 만든다.
      reserveSet.add(i);
    }
    for(int i : lost) {
      if(reserveSet.contains(i)) { // 체육복을 잃어버린 학생이 여벌 체육복을 가진 경우
        reserveSet.remove(i); // 여벌 체육복을 본인이 입음(집합에서 제거)
      } else {
        lostSet.add(i); // 체육복을 잃어버린 학생이 여벌 체육복이 없는 경우 잃어버린 학생 집합으로 만든다.
      }
    }
    for(int i : lostSet) {
      if(reserveSet.contains(i-1)) { // 잃어버린 학생 왼쪽 학생이 체육복을 가진 경우
        reserveSet.remove(i-1); // 빌려준다.(여벌 체육복을 가진 학생 집합에서 제거)
      } else if(reserveSet.contains(i+1)) { // 잃어버린 학생 오른쪽 학생이 체육복을 가진 경우
        reserveSet.remove(i+1); // 빌려준다.(여벌 체육복을 가진 학생 집합에서 제거)
      } else {
        answer--; // 그렇지 않은 경우 체육복을 빌릴 수 없으므로 수업에 참여할 수 없다.
      }
    }
    return answer;
  }

  public int solution2(int n, int[] lost, int[] reserve) {
    int[] people = new int[n];
    int answer = n;

    for (int l : lost) {
      people[l-1]--;
    }
    for (int r : reserve) {
      people[r-1]++;
    }

    for (int i = 0; i < people.length; i++) {
      if(people[i] == -1) {
        if(i-1>=0 && people[i-1] == 1) {
          people[i]++;
          people[i-1]--;
        }else if(i+1< people.length && people[i+1] == 1) {
          people[i]++;
          people[i+1]--;
        } else {
          answer--;
        }
      }
    }
    return answer;
  }

  public int solution3(int n, int[] lost, int[] reserve) {
    ArrayList<Student> arr = new ArrayList<>();
    ArrayList<Student> returnArr = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
      Student st = new Student(i, true, false);
      arr.add(st);
    } // 모든 학생이 체육복을 가지고 있고, 여벌은 없다고 초기화


    for (int i = 0; i < arr.size(); i++) {
      // 잃어버린 학생 명단에 있으면, 가지고 있는게 없다고 필드값 변경
      for (int lostNo = 0; lostNo < lost.length; lostNo++) {
        if (lost[lostNo] == arr.get(i).getNo()) {
          arr.get(i).setHave(false);
        }
      }

      //여벌 처리
      for (int reserveNo = 0; reserveNo < reserve.length; reserveNo++) {
        // 위에서 만든 객체 중 여벌을 가지고 있는 객체일 경우
        if (reserve[reserveNo] == arr.get(i).getNo()) {
          if (arr.get(i).getHave() == false) { // 여벌도 있으면서 도난 당한 경우
            arr.get(i).setHave(true);
          } else { // 체육복이 있고 여벌도 가지고 있는 경우
            arr.get(i).setMorehave(true);
          }
        }
      }
    }
    /////////////////////////////이상 초기화 완료 ///////////////////////////////

    for (int i = 0; i < n; i++) { // 총 학생 인원만큼 순회
      if (arr.get(i).getHave() == false) { // 체육복이 없는 객체를 찾아서
        if (i < arr.size()-1 && arr.get(i+1).getMorehave() == true) { // 뒤 학생이 여벌을 가지고 있으면
          arr.get(i+1).setMorehave(false); // 빌려준다.
          arr.get(i).setHave(true);
        } else if (i > 0 && arr.get(i-1).getMorehave() == true) { // 앞 학생이 여벌을 가지고 있으면
          arr.get(i-1).setMorehave(false); // 빌려준다.
          arr.get(i).setHave(true);
        }
      }
      if (arr.get(i).getHave() == true) {
        returnArr.add(arr.get(i)); // 최종적으로 체육복이 있는 학생 명단을 만든다.
      }
    }
    for (int i = 0; i < returnArr.size(); i++) {
      System.out.println(returnArr.get(i).getNo());
    }
    return returnArr.size();
  }

  public static int solution4(int n, int[] lost, int[] reserve) {
    int[] state1 = new int[n];
    int[] state2 = new int[n];

    init(state1, lost, reserve); // [2, 0, 2, 0, 2]
    init(state2, lost, reserve); // [2, 0, 2, 0, 2]

    return Math.max(fOrder(state1, n), bOrder(state2, n));
  }

  public static void init(int[] state, int[] lost, int[] reserve) {
    // 5 lost=[2, 4] reserve=[1, 3, 5]
    Arrays.fill(state, 1); // [1, 1, 1, 1, 1]
    for (int idx : lost) {
      state[idx - 1]--; // [1, 0, 1, 0 , 1]
    }
    for (int idx : reserve) {
      state[idx - 1]++; // [2, 0, 2, 0, 2]
    }
  }

  public static int fOrder(int[] state, int n) {
    fRent(state, n);
    bRent(state, n);
    return (int) Arrays.stream(state).filter(i -> i > 0).count();
  }

  public static int bOrder(int[] state, int n) {
    bRent(state, n);
    fRent(state, n);
    return (int) Arrays.stream(state).filter(i -> i > 0).count();
  }

  public static void fRent(int[] state, int n) {
    for (int i = 0; i < n - 1; i++) {
      if (state[i] == 2 && state[i + 1] == 0) {
        state[i]--;
        state[i + 1]++;
      }
    }
  }

  public static void bRent(int[] state, int n) {
    for (int i = 1; i < n; i++) {
      if (state[i] == 2 && state[i - 1] == 0) {
        state[i]--;
        state[i - 1]++;
      }
    }
  }
  //5 lost=[2, 4] reserve=[1, 3, 5]
  public static int solution5(int n, int[] lost, int[] reserve) {
    BiConsumer<int[], Integer> fRent = (int[] stateFRent, Integer nFRent) -> {
      for (int i = 0; i < nFRent - 1; i++) {
        if (stateFRent[i] == 2 && stateFRent[i + 1] == 0) {
          stateFRent[i]--;
          stateFRent[i + 1]++;
        }
      }
    };
    BiConsumer<int[], Integer> bRent = (int[] stateBRent, Integer nBRent) -> {
      for (int i = 1; i < nBRent; i++) {
        if (stateBRent[i] == 2 && stateBRent[i - 1] == 0) {
          stateBRent[i]--;
          stateBRent[i - 1]++;
        }
      }
    };
    int[] state1 = new int[n];
    int[] state2 = new int[n];
    init(state1, lost, reserve); // [2, 0, 2, 0, 2]
    init(state2, lost, reserve); // [2, 0, 2, 0, 2]

    return Math.max(runOrder(state1, n, fRent, bRent), runOrder(state2, n, bRent, fRent));
  }

  public static int runOrder(int[] state, int n, BiConsumer<int[], Integer> run1,
      BiConsumer<int[], Integer> run2) {
    run1.accept(state, n);
    run2.accept(state, n);
    return (int) Arrays.stream(state).filter(i -> i > 0).count();
  }

}//GymSuit

class Student {
  int no;
  boolean have;
  boolean morehave;

  public Student(int no, boolean have, boolean morehave) {
    this.no = no;
    this.have = have;
    this.morehave = morehave;
  }

  public int getNo() {
    return no;
  }
  public boolean getHave() {
    return have;
  }
  public void setHave(boolean have) {
    this.have = have;
  }
  public boolean getMorehave() {
    return morehave;
  }
  public void setMorehave(boolean morehave) {
    this.morehave = morehave;
  }
}

class Solution {
  public int solution(int n, int[] lost, int[] reserve) {
    int answer = 0;
    for(int i = 0; i < lost.length; i++) {
      for (int j = 0; j < reserve.length; j++) {
        if (lost[i] == reserve[j]) {
          reserve[j] = 0;
          lost[i] = 0;
          //중복값있으니 빼줌
        } // 중복값아니니 그냥둠
        else {
          continue;
        }
      }
    }

    for (int i = 0; i < reserve.length; i++) {
      if (reserve[i] == 0 ) {
        continue;
      }
      // reserve[i]값을 확인
      if ( 1  == reserve[i] ) {
        for (int j = 0; j < lost.length ; j++) {
          if (lost[j] - 1 == reserve[i]) {
            lost[j] = 0;
            break;
          } else {
            continue;
          }
        }
      }
      else if (reserve[i] == n) {
        for (int j = 0; j < lost.length ; j++) {
          if (lost[j] + 1 == reserve[i]) {
            lost[j] = 0;
            break;
          } else {
            continue;
          }
        }
      } else {
        for (int j = 0; j < lost.length ; j++) {
          if ((lost[j] + 1 == reserve[i])
              || (lost[j] - 1 == reserve[i])) {
            lost[j] = 0;
            break;
          } else {
            continue;
          }
        }
      }
    }
    int lostnum = 0;
    for (int i = 0; i < lost.length; i++) {
      if (lost[i] != 0) {
        lostnum++;
      }
    }
    answer = n - lostnum;
    return answer;
  }
}

