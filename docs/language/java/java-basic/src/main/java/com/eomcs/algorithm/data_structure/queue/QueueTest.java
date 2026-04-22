package com.eomcs.algorithm.data_structure.queue;

public class QueueTest {

  public static void main(String[] args) {
    Queue<String> q = new Queue<>();
    
    q.offer("aa");
    q.offer("bb");
    q.offer("cc");
    
    while (q.size() > 0) {
      System.out.println(q.poll());
    }
    

  }

}
