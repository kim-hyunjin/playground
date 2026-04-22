package com.eomcs.lms;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import com.eomcs.lms.context.ApplicationContextListener;
import com.eomcs.lms.domain.Board;
import com.eomcs.lms.domain.Lesson;
import com.eomcs.lms.domain.Member;
import com.google.gson.Gson;

// 애플리케이션이 시작되거나 종료될 때 데이터를 로딩하고 저장하는 일을 한다.
public class DataLoaderListener implements ApplicationContextListener{
  List<Lesson> lessonList = new ArrayList<>();
  List<Member> memberList = new ArrayList<>();
  List<Board> boardList = new ArrayList<>();

  @Override
  public void contextInitailized(Map<String, Object> context) {
    System.out.println("데이터를 로딩합니다.");

    // 애플리케이션 시작 시 데이터 로드

    loadLessonData();
    loadMemberData();
    loadBoardData();

    // 데이터가 저장되어 있는 List 객체를 이 메서드를 호출한 쪽에서 사용할 수 있도록
    // Map 객체에 담아둔다.
    context.put("boardList", boardList);
    context.put("lessonList", lessonList);
    context.put("memberList", memberList);
  }

  @Override
  public void contextDestroyed(Map<String, Object> context) {
    System.out.println("데이터를 저장합니다.");

    // 애플리케이션 종료 시 데이터 저장

    saveLessonData();
    saveMemberData();
    saveBoardData();
  }

  private void loadLessonData() {
    File file = new File("./lesson.json");
    try (BufferedReader in = new BufferedReader(new FileReader(file));) {
      lessonList.addAll(Arrays.asList(new Gson().fromJson(in, Lesson[].class)));
      System.out.printf("총 %d 개의 수업 데이터를 로딩했습니다.\n", lessonList.size());
    } catch (Exception e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
    }
  } // end loadLessonData

  private void saveLessonData() {
    File file = new File("./lesson.json");
    try (BufferedWriter out = new BufferedWriter(new FileWriter(file))) {
      out.write(new Gson().toJson(lessonList));
      System.out.printf("총 %d개의 수업 데이터를 저장하였습니다. \n", lessonList.size());
    } catch (Exception e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    }
  }// end saveLessonData

  private void loadMemberData() {
    File file = new File("./member.json");
    try (BufferedReader in = new BufferedReader(new FileReader(file)); Scanner dataScan = new Scanner(in);) {
      memberList.addAll(Arrays.asList(new Gson().fromJson(in, Member[].class)));
      System.out.printf("총 %d 개의 회원 데이터를 로딩했습니다.\n", memberList.size());
    } catch (Exception e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
    }
  } // end loadMemberData

  private void saveMemberData() {
    File file = new File("./member.json");
    try (BufferedWriter out = new BufferedWriter(new FileWriter(file))) {
      out.write(new Gson().toJson(memberList));
      System.out.printf("총 %d개의 회원 데이터를 저장하였습니다. \n", memberList.size());
    } catch (IOException e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    }
  }// end saveLessonData

  private void loadBoardData() {
    File file = new File("./board.json");
    try (BufferedReader in = new BufferedReader(new FileReader(file));) {
      boardList.addAll(Arrays.asList(new Gson().fromJson(in, Board[].class)));
      System.out.printf("총 %d 개의 게시물 데이터를 로딩했습니다.\n", boardList.size());
    } catch (Exception e) {
      System.out.println("파일 읽기 중 오류 발생! - " + e.getMessage());
    }
  } // end loadBoardData

  private void saveBoardData() {
    File file = new File("./board.json");
    try (BufferedWriter out = new BufferedWriter(new FileWriter(file))) {
      out.write(new Gson().toJson(boardList));
      System.out.printf("총 %d개의 게시물 데이터를 저장하였습니다. \n", boardList.size());
    } catch (IOException e) {
      System.out.println("파일 쓰기 중 오류 발생! " + e.getMessage());
    }
  }// end saveLessonData
}
