package com.eomcs.util;

// 컬렉션에서 값을 꺼내는 방법을 정의
public interface Iterator<E> {
  boolean hasNext();
  E next();
}
