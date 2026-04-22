package com.exam.singleton;

public class SynchronizedSingleton {
    private static SynchronizedSingleton uniqueInstance;

    private SynchronizedSingleton() {}

    public static synchronized SynchronizedSingleton getInstance() { // 한 스레드가 메소드 사용을 끝내기 전까지 다른 스레드는 기다려야 함 ==> 멀티스레딩 환경에서도 싱글턴 가능.. 하지만 병목이 발생할 수 있다.
        if (uniqueInstance == null) {
            uniqueInstance = new SynchronizedSingleton();
        }
        return uniqueInstance;
    }
}
