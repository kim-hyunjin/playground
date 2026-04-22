package com.eomcs.util;

import java.lang.reflect.Array;

public class LinkedList<E> extends AbstractList<E> {
  private Node<E> first;
  private Node<E> last;
  
  public void add(E element) {
    Node<E> newNode = new Node<>();
    newNode.item = element;
    
    if (first == null) {
      last = first = newNode;
    } else {
      last.next = newNode;
      last = newNode;
    }
    size++;
  }
  
  public void add(int index, E element) {
    if (index < 0 || index >= size) {
      return;
    }
    Node<E> newNode = new Node<>();
    newNode.item = element;
    
    Node<E> cursor = first;
    for (int i = 0; i < index - 1; i++) {
      cursor = cursor.next;
    }
    
    if (index == 0) {
      newNode.next = first;
      first = newNode;
    } else {
      newNode.next = cursor.next;
      cursor.next = newNode;
    }
    size++;
  }
  
  public E get(int index) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node<E> cursor = first;
    for (int i = 0; i < index; i++) {
      cursor = cursor.next;
    }
    return cursor.item;
  }
  
  public E remove(int index) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node<E> cursor = first;
    for (int i = 0; i < index - 1; i++) {
      cursor = cursor.next;
    }
    Node<E> deleteNode = null;
    if (index == 0) {
      deleteNode = first;
      first = deleteNode.next;
    } else {
      deleteNode = cursor.next;
      cursor.next = deleteNode.next;
    }
    deleteNode.next = null;
    size--;
    return deleteNode.item;
  }
  
  public E set(int index, E e) {
    if (index < 0 || index >= size) {
      return null;
    }
    Node<E> cursor = first;
    for (int i = 0; i < index; i++) {
      cursor = cursor.next;
    }
    E oldElement = cursor.item;
    cursor.item = e;
    
    return oldElement;
  }
  
  public Object[] toArray() {
    Object[] arr = new Object[size];
    
    Node<E> cursor = first;
    for (int i = 0; i < size; i++) {
      arr[i] = cursor.item;
      cursor = cursor.next;
    }
    return arr;
  }
  
  @SuppressWarnings("unchecked")
  public E[] toArray(E[] arr) {
    
    if (arr.length < size) {
      arr = (E[]) Array.newInstance(arr.getClass().getComponentType(), size);
    }
    
    Node<E> cursor = first;
    for (int i = 0; i < size; i++) {
      arr[i] = cursor.item;
      cursor = cursor.next;
    }
    return arr;
  }
  
  static class Node<T> {
    T item;
    Node<T> next;
  }
}
