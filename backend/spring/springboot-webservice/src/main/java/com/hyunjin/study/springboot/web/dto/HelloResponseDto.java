package com.hyunjin.study.springboot.web.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter // 모든 필드의 get 메소드 생성
@RequiredArgsConstructor // 선언된 final 필드가 모두 포함된 생성자를 만들어준다.(final이 없는 필드는 생성자에 포함하지 않는다.)
public class HelloResponseDto {

    private final String name;
    private final int amount;
}
