package com.hyunjin.study.springboot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Slf4j
@SpringBootApplication // 스프링 부트의 자동설정. Bean 읽기와 생성을 모두 자동으로 설정(이 애노테이션이 있는 위치부터 설정을 읽어가기 때문에 항상 프로젝트의 최상단에 위치해야함)
public class Application { // 앞으로 만들 프로젝트의 메인 클래스
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args); // 내장 WAS 실행
    }
}
