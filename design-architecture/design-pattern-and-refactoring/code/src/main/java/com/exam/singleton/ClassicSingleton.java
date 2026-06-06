package com.exam.singleton;

public class ClassicSingleton {
    private static ClassicSingleton uniqueInstance;

    private ClassicSingleton() {}

    public static ClassicSingleton getInstance() { // ==> 멀티스레딩 환경에서는 문제가 발생..
        if (uniqueInstance == null) {
            uniqueInstance = new ClassicSingleton(); // 게으른 인스턴스 생성 (lazy instantiation)
        }
        return uniqueInstance;
    }
}
