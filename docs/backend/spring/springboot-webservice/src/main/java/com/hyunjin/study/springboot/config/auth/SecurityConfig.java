package com.hyunjin.study.springboot.config.auth;

import com.hyunjin.study.springboot.domain.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@RequiredArgsConstructor
@EnableWebSecurity // Spring Security 설정들을 활성화
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().headers().frameOptions().disable() // h2-console 화면을 사용하기 위해 해당 옵션들을 disable 한다.
                .and().authorizeRequests() // URL별 권한 관리를 설정하는 옵션의 시작점. authorizeRequests가 선언되어야 antMatchers 옵션을 사용할 수 있음.
                .mvcMatchers(HttpMethod.GET, "/posts/*").permitAll()
                .antMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**", "/profile").permitAll() // 권한 관리 대상을 지정하는 옵션. permitAll - 전체 열람 권한 부여
                .antMatchers("/api/v1/posts", "/api/v1/posts/**", "/posts-form").hasRole(Role.USER.name()) // /api/v1/** 주소를 가진 API는 USER권한을 가진 사람만 가능.
                .anyRequest().authenticated().and() // 나머지 URL도 모두 인증된 사용자들에게만 허용
                .logout() // 로그아웃 기능에 대한 여러 설정의 진입점.
                .logoutSuccessUrl("/").and() // 로그아웃 성공시 / 주소로 이동.
                .oauth2Login() // OAuth 2 로그인 기능 여러 설정의 진입점.
                .userInfoEndpoint() // OAuth2 로그인 성공 이후 사용자 정보를 가져올 때 설정을 담당
                .userService(customOAuth2UserService); // 소셜 로그인 성공 후 후속조치를 진행할 UserService 인터페이스의 구현체 등록.
    }
}
