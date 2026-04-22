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
    // local class : 특정 메서드 안에서만 사용되는 클래스라면 로컬 클래스로 정의하라
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
    // 로컬 클래스는 인스턴스 멤버가 아니다.
    // 따라서 로컬 클래스의 생성자를 호출할 때 앞쪽에 this. 를 지정해서는 안된다.
    return new QueueIterator<>();
  }
}

