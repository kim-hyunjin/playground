package com.eomcs.lms.context;

import java.util.Map;

// 애플리케이션의 상태가 변경되었을 때
// 호출할 메서드 규칙을 정의한다.
// 즉 애플리케이션 상태 변경에 대해 보고를 받을 옵저버 규칙을 정의한다.
// 보통 옵저버를 Listener라 부른다.
//
public interface ApplicationContextListener {
  // 이 메서드는 애플리케이션이 시작될 때 호출된다.
  void contextInitailized(Map<String, Object> context);

  // 이 메서드는 애플리케이션이 종료될 때 호출된다.
  void contextDestroyed(Map<String, Object> context);

  // 호출자가 옵저버의 결과를 받을 수 있도록 파라미터로 맵 객체를 전달할 것이다.
  // 리턴 값으로 결과를 전달하지 않고, 파라미터로 넘어온 저장소에 보관하는 방법을 사용한다.
  // 왜 이런 방식을 사용하는가?
  // => 파라미터 방식은 메서드에게 정보를 전달할 수 있기 때문이다.
  //

}
