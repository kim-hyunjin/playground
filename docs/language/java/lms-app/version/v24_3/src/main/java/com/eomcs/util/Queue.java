package com.eomcs.util;

public class Queue<E> extends LinkedList<E> implements Cloneable {
  public void offer(E value) {
    this.add(value);
  }
  
  public E poll() {
    return this.remove(0);
  }
  
  @Override
  public Queue<E> clone() {
    Queue<E> destination = new Queue<>();
    for (int i = 0; i < this.size(); i++) {
      destination.offer(this.get(i));
    }
    return destination;
  }
  
  @Override
  public Iterator<E> iterator() {
    // this = 인스턴스 주소;
    // inner class의 생성자를 호출할 때 바깥 클래스의 인스턴스 주소를 파라미터로 넘기지말고
    // 앞에서 넘겨라
    return this.new QueueIterator<>();
  }
  
  // non-static nested class = inner class
  class QueueIterator<T> implements Iterator<T> {
    Queue<T> queue;

    @SuppressWarnings("unchecked")
    public QueueIterator() {
      this.queue = (Queue<T>) Queue.this.clone();
    }

    @Override
    public boolean hasNext() {
      return queue.size() > 0;
    }

    @Override
    public T next() {
      return queue.poll();
    }
  }
}

/*
 * 클래스 멤버!
 * class 클래스 {
 * 필드 선언
 * 초기화블록
 * 생성자
 * 메서드
 * 중첩클래스
 * 
 */

