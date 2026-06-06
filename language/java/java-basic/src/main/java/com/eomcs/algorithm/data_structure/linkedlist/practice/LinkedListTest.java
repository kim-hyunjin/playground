package com.eomcs.algorithm.data_structure.linkedlist.practice;

public class LinkedListTest {

  public static void main(String[] args) {
    LinkedList<String> list = new LinkedList<>();
    list.add("aaa");
    list.add("bbb");
    list.add("ccc");
    list.add("ddd");
    list.add("eee");
    list.add("fff");
    list.add("ggg");
    
    list.set(1, "mmm");
    list.remove(2);
    list.add(3, "xxx");
    list.remove(5);
    
    print(list);
    
    System.out.println(list.get(-1));
    System.out.println(list.get(list.size() + 1));
  }
  static void print(LinkedList<String> list) {
    //String[] arr = list.toArray(new String[0]);
    
    String[] arr = new String[list.size()];
    list.toArray(arr);
    for (Object o : arr) {
      System.out.println(o);
    }
  }
}
