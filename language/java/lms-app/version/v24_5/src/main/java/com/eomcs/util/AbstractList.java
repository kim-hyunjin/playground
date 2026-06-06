package com.eomcs.util;

public abstract class AbstractList<E> implements List<E> {
  protected int size;
  public int size() {
    return size;
  }

  @Override
  public Iterator<E> iterator() {
    // anonymous class : 인스턴스를 한개만 생성할 거라면 익명클래스로 정의하라.
    return new Iterator<E>() { // 바깥클래스의 타입파라미터를 그대로 사용한다.  //인터페이스가 없다면 new Object
      List<E> list = (List<E>)AbstractList.this;
      int cursor;

      // 익명 클래스는 생성자를 만들 수 없기 때문에
      // 인스턴스필드를 초기화시키기 위해서는
      // 다음과 같이 인스턴스 블럭을 사용해야한다. (initializer block)
      // 물론 단순히 값을 할당하는 경우에는 인스턴스 블록에 넣지 않고,
      // 필드 선언할 때 바로 할당 연산자를 사용할 수 있다.
      /*{
        this.list = (List<E>)AbstractList.this;
      }*/

      @Override
      public boolean hasNext() {
        return cursor < list.size();
      }

      @Override
      public E next() {
        return list.get(cursor++);
      }
    };
  }



}//end public class
