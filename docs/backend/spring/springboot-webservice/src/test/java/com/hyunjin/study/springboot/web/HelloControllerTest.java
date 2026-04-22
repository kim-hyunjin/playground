package com.hyunjin.study.springboot.web;

import com.hyunjin.study.springboot.config.auth.SecurityConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class) // SpringRunner - 스프링 부트 테스트와 JUnit 사이에 연결자 역할
@WebMvcTest(controllers = HelloController.class, // 스프링 MVC에 집중할 수 있는 테스트 어노테이션 - WebSecurityConfigurerAdapter, WebMvcConfigurer를 비롯한 @Controller @ControllerAdvice 등 사용 가능.
            excludeFilters = {
            @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class)
            }) // @Repository, @Service, @Component는 스캔 대상이 아니므로 스캔대상에서 SecurityConfig 제거
public class HelloControllerTest {

    @Autowired // 스프링이 관리하는 빈 주입
    private MockMvc mvc; // 웹 API(GET, POST 등)를 테스트할 때 사용.

    @WithMockUser(roles = "USER")
    @Test
    public void hello() throws Exception {
        String hello = "hello";

        mvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string(hello));
    }

    @WithMockUser(roles = "USER")
    @Test
    public void helloDto() throws Exception {
        String name = "hello";
        int amount = 1000;

        mvc.perform(get("/hello/dto").param("name", name).param("amount", String.valueOf(amount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(name)))
                .andExpect(jsonPath("$.amount", is(amount)));
        // param - API 테스트 시 사용될 요청 파라미터 설정. String값만 허용됨.
        // jsonPath - JSON 응답값을 필드별로 검증할 수 있는 메소드. $를 기준으로 필드명을 명시.

    }
}
