package com.eomcs.util;

//Stack 객체에서 Iterator 규칙에 따라 값을 꺼내주는 클래스 정의
public class StackIterator<E> implements Iterator<E> {
  Stack<E> stack;

  public StackIterator(Stack<E> stack) {
    // 스택은 값을 꺼내면 제거되기 때문에 clone()한다.
    this.stack = stack.clone();
  }

  @Override
  public boolean hasNext() {
    return !stack.empty();
  }

  @Override
  public E next() {
    return stack.pop();
  }
}
