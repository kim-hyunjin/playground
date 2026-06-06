package com.exam.compound;

import com.exam.compound.duck.Flock;
import com.exam.compound.duck.QuackCounter;
import com.exam.compound.duck.Quackable;
import com.exam.compound.factory.AbstractDuckFactory;
import com.exam.compound.factory.CountingDuckFactory;
import com.exam.compound.observer.Quackologist;
import com.exam.compound.goose.Goose;
import com.exam.compound.goose.GooseAdapter;

public class DuckSimulator {
    public static void main(String[] args) {
        DuckSimulator simulator = new DuckSimulator();
        AbstractDuckFactory duckFactory = new CountingDuckFactory();
        simulator.simulate(duckFactory);
    }

    void simulate(AbstractDuckFactory duckFactory) {
        // 데코레이터
//        Quackable mallardDuck = new QuackCounter(new MallardDuck());
//        Quackable redheadDuck = new QuackCounter(new RedheadDuck());
//        Quackable duckCall = new QuackCounter(new DuckCall());
//        Quackable rubberDuck = new QuackCounter(new RubberDuck());

        // 팩토리
        Quackable mallardDuck = duckFactory.createMallardDuck();
        Quackable redheadDuck = duckFactory.createRedheadDuck();
        Quackable duckCall = duckFactory.createDuckCall();
        Quackable rubberDuck = duckFactory.createRubberDuck();

        // 어댑터
        Quackable gooseDuck = new GooseAdapter(new Goose());

        System.out.println("\nDuck Simulator");

        // 컴포지트
        Flock flockOfDucks = new Flock();
        flockOfDucks.add(mallardDuck);
        flockOfDucks.add(redheadDuck);
        flockOfDucks.add(duckCall);
        flockOfDucks.add(rubberDuck);
        flockOfDucks.add(gooseDuck);

        Flock flockOfMallards = new Flock();
        flockOfMallards.add(duckFactory.createMallardDuck());
        flockOfMallards.add(duckFactory.createMallardDuck());
        flockOfMallards.add(duckFactory.createMallardDuck());

        flockOfDucks.add(flockOfMallards);

        // 옵저버
        Quackologist quackologist = new Quackologist();
        flockOfDucks.registerObserver(quackologist);

        System.out.println("\nDuck Simulator: Whole Flock Simulation");
        simulate(flockOfDucks);

        System.out.println("The ducks quacked " + QuackCounter.getNumberOfQuacks() + " times");
    }

    void simulate(Quackable duck) {
        duck.quack();
    }
}
