package com.notequiz.domain.auth.service;

import com.notequiz.common.exception.ApiException;
import com.notequiz.common.exception.ErrorCode;
import com.notequiz.common.security.JwtProvider;
import com.notequiz.domain.auth.dto.LoginRequest;
import com.notequiz.domain.auth.dto.SignupRequest;
import com.notequiz.domain.auth.dto.TokenResponse;
import com.notequiz.domain.user.entity.User;
import com.notequiz.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request, AuthTokens outTokens) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtProvider.createRefreshToken(user.getEmail());

        outTokens.setRefreshToken(refreshToken);

        return new TokenResponse(accessToken, user.getNickname());
    }

    @Transactional(readOnly = true)
    public String refresh(String refreshToken) {
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new ApiException(ErrorCode.INVALID_TOKEN);
        }

        String email = jwtProvider.getEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        return jwtProvider.createAccessToken(user.getEmail());
    }

    // Helper class to return multiple tokens from login
    @lombok.Setter
    @lombok.Getter
    public static class AuthTokens {
        private String refreshToken;
    }
}
