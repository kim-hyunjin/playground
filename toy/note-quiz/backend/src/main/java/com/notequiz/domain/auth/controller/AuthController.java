package com.notequiz.domain.auth.controller;

import com.notequiz.common.exception.ApiException;
import com.notequiz.common.exception.ErrorCode;
import com.notequiz.domain.auth.dto.LoginRequest;
import com.notequiz.domain.auth.dto.SignupRequest;
import com.notequiz.domain.auth.dto.TokenResponse;
import com.notequiz.domain.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody @Valid SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @RequestBody @Valid LoginRequest request,
            HttpServletResponse response
    ) {
        AuthService.AuthTokens authTokens = new AuthService.AuthTokens();
        TokenResponse tokenResponse = authService.login(request, authTokens);

        Cookie cookie = new Cookie("refreshToken", authTokens.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // development only
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(30 * 24 * 60 * 60); // 30 days
        response.addCookie(cookie);

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshToken == null) {
            throw new ApiException(ErrorCode.INVALID_TOKEN);
        }

        String accessToken = authService.refresh(refreshToken);
        return ResponseEntity.ok(new TokenResponse(accessToken, null));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}
