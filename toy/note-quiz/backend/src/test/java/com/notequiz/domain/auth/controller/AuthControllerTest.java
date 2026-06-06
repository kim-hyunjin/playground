package com.notequiz.domain.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notequiz.common.security.JwtProvider;
import com.notequiz.domain.auth.dto.LoginRequest;
import com.notequiz.domain.auth.dto.SignupRequest;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void signup_ShouldRegisterUser() throws Exception {
        SignupRequest request = new SignupRequest("test@test.com", "password123", "tester");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void signup_DuplicateEmail_ShouldFail() throws Exception {
        userRepository.save(User.builder()
                .email("test@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .nickname("tester")
                .build());

        SignupRequest request = new SignupRequest("test@test.com", "newpassword", "newtester");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_ShouldReturnTokens() throws Exception {
        userRepository.save(User.builder()
                .email("test@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .nickname("tester")
                .build());

        LoginRequest request = new LoginRequest("test@test.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.nickname").value("tester"))
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().httpOnly("refreshToken", true));
    }

    @Test
    void refresh_ShouldIssueNewAccessToken() throws Exception {
        userRepository.save(User.builder()
                .email("test@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .nickname("tester")
                .build());

        String refreshToken = jwtProvider.createRefreshToken("test@test.com");
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setPath("/api/auth/refresh");

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }
}
