package com.exam.singleton;

/**
 * DCL(Double-Checking Locking)을 써서 getInstance()에서 동기화되는 부분을 줄입니다.
 */
public class DCLSingleton {
    // volatile 키워드를 사용하면 멀티스레딩을 쓰더라도 uniqueInstance 변수가 Singleton 인스턴스로 초기화 되는 과정이 올바르게 진행되도록 할 수 있습니다.
    private volatile static DCLSingleton uniqueInstance;

    private DCLSingleton() {}

    public static DCLSingleton getInstance() {
        if (uniqueInstance == null) { // 인스턴스가 없는지 확인하고, 없으면 동기화된 블럭으로 들어갑니다.
            synchronized (DCLSingleton.class) {
                if (uniqueInstance == null) {
                    uniqueInstance = new DCLSingleton();
                }
            }
        }
        return uniqueInstance;
    }
}
