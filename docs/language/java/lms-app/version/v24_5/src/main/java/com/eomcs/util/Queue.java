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
    // anonymous class : 인스턴스를 한개만 생성하는 클래스인 경우 익명클래스로 만든다.
    return new Iterator<E>() { //인터페이스가 없다면 new Object
      Queue<E> queue = (Queue<E>) Queue.this.clone();
      @Override
      public boolean hasNext() {
        return queue.size() > 0;
      }

      @Override
      public E next() {
        return queue.poll();
      }
    };
  } // end iterator()
} // end public class

