### 코틀린 리플렉션 API 인터페이스 구조
```
                KAnnotatedElement
             /          |           \
        KClass      KCallable       KParameter
                    /        \
                KFunction    KProperty
            KFunction0        KMutableProperty
            KFunction1
            ...
            KProperty.Getter
            KMutableProperty.Setter
```

## 요약
- 코틀린에서 애노테이션을 적용할 때 사용하는 문법은 자바와 거의 같다.
- 코틀린에서는 자바보다 더 넓은 대상에 애노테이션을 적용할 수 있다.(파일, 식 등)
- 애노테이션 인자로 원시 타입 값, 문자열, enum, 클래스 참조, 다른 애노테이션 클래스의 인스턴스, 그리고 이것들의 배열을 사용할 수 있다.
- @get:Rule 을 사용해 애노테이션의 사용대상을 명시하면 한 코틀린 선언이 여러 가지 바이트코드 요소를 만들어내는 경우 정확히 어떤 부분에 애노테이션을 적용할지 지정할 수 있다.
- 애노테이션 클래스를 정의할 때는 본문이 없고 주 생성자의 모든 파라미터를 val 로 표시한 코틀린 클래스를 사용한다.
- 메타애노테이션을 사용해 대상, 애노테이션 유지 방식 등 애노테이션 특성을 지정할 수 있다.
- 리플렉션 API를 통해 실행 시점에 객체의 메소드와 프로퍼티를 열거하고 접근할 수 있다. KClass, KFunction 등 여러 종류의 선언을 표현하는 인터페이스가 들어있다.
- 클래스를 컴파일 시점에 알고 있다면 KClass 인스턴스를 얻기 위해 ClassName::class 를 사용한다. (실행시점에 변수에 담긴 객체로부터 KClass를 얻고싶다면 obj.javaClass.kotlin)
- KFunction 과 KProperty 인터페이스는 모두 KCallable을 확장한다. KCallable은 제네릭 call 메소드를 제공한다.
- KCallable.callBy 메소드를 사용하면 메소드를 호출하면서 디폴트 파라미터 값을 사용할 수 있다.
- KFunction0, KFunction1 등의 인터페이스는 모두 파라미터 수가 다른 함수를 표현하며, invoke 메소드를 사용해 호출할 수 있다.
- KProperty0 은 최상위 프로퍼티나 변수에 접근할 때 쓰는 인터페이스다. 
- KProperty1 은 수신객체가 있는 프로퍼티에 접근할 때 쓰는 인터페이스다. 
- KProperty 인터페이스 모두 get 메소드를 사용해 값을 가져올 수 있다.
- KMutableProperty0, KMutableProperty1은 각각 KProperty0, KProperty1을 확장하며, set 메소드를 통해 프로퍼티 값을 변경할 수 있게 한다.