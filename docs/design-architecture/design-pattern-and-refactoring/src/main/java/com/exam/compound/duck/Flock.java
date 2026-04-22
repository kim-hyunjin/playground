package com.exam.compound.duck;

import com.exam.compound.observer.Observable;
import com.exam.compound.observer.Observer;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Flock implements Quackable {
    List<Quackable> quackers = new ArrayList<>();

    public void add(Quackable quacker) {
        quackers.add(quacker);
    }

    @Override
    public void quack() {
        // 이터레이터 패턴
        Iterator iterator = quackers.iterator();
        while (iterator.hasNext()) {
            Quackable quacker = (Quackable) iterator.next();
            quacker.quack();
        }
    }

    @Override
    public void registerObserver(Observer observer) {
        for (Quackable quacker : quackers) {
            quacker.registerObserver(observer);
        }
    }

    @Override
    public void notifyObservers() {
        // quack()에서 quackers 길이만큼 반복문을 돌며 quacker.quack()를 호출할 때 Quackable 객체에서 알아서 옵저버한테 연락돌림.
    }
}
