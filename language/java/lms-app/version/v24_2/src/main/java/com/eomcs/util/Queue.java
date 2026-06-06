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
    return new QueueIterator<>(this);
  }
  
  static class QueueIterator<E> implements Iterator<E> {
    Queue<E> queue;

    public QueueIterator(Queue<E> queue) {
      this.queue = queue.clone();
    }

    @Override
    public boolean hasNext() {
      return queue.size() > 0;
    }

    @Override
    public E next() {
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

