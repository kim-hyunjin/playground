package com.exam.singleton;

public class NotLazySingleton {
    private static NotLazySingleton uniqueInstance = new NotLazySingleton();

    private NotLazySingleton() {}

    public static NotLazySingleton getInstance() {
        return uniqueInstance;
    }
    /**
     * 이 방법을 사용하면 클래스가 로딩될 때 JVM에서 Singleton의 유일한 인스턴스를 생성해준다. ==> 멀티스레딩 환경에서도 문제 없음.
     */
}
