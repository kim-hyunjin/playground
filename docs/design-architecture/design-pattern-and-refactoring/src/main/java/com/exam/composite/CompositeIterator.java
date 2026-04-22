package com.exam.composite;

import java.util.Iterator;
import java.util.Stack;

public class CompositeIterator implements Iterator{
    Stack stack = new Stack();

    public CompositeIterator(Iterator iterator) { // 반복작업을 처리할 대상 중 최상위 복합 객체의 반복자가 전달됨
        stack.push(iterator);
    }

    @Override
    public boolean hasNext() {
        if (stack.empty()) {
            return false;
        } else {
            Iterator iterator = (Iterator) stack.peek(); // 스택이 비어있지 않다면 맨 위에서 반복자를 꺼내 다음 원소가 있는지 알아봅니다.
            if (!iterator.hasNext()) { // 다음 원소가 없으면 스택 맨 위에 있는 객체를 꺼내 재귀적으로 hasNext()를 호출합니다.
                stack.pop();
                return hasNext();
            } else {
                return true;
            }
        }
    }

    @Override
    public Object next() {
        if (hasNext()) {
            Iterator iterator = (Iterator) stack.peek();
            MenuComponent component = (MenuComponent) iterator.next();
            if (component instanceof Menu) { // 그 원소가 메뉴면 반복작업에 또 다른 복합 객체가 추가된 것이므로 스택에 집어넣는다.
                stack.push(component.createIterator());
            }
            return component;
        } else {
            return null;
        }
    }

    @Override
    public void remove() {
        throw new UnsupportedOperationException();
    }
}
