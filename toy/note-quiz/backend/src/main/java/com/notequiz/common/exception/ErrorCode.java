package com.notequiz.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 파일
    INVALID_FILE_FORMAT(400, "지원하지 않는 파일 형식입니다."),
    FILE_TOO_LARGE(400, "파일 크기가 20MB를 초과합니다."),
    TEXT_EXTRACT_FAILED(422, "텍스트 추출에 실패했습니다."),

    // LLM
    LLM_TIMEOUT(504, "LLM 응답 시간이 초과되었습니다."),

    // 퀴즈
    QUIZ_NOT_FOUND(404, "퀴즈를 찾을 수 없습니다."),
    UPLOAD_NOT_FOUND(404, "업로드 정보를 찾을 수 없습니다."),
    RESULT_NOT_FOUND(404, "결과를 찾을 수 없습니다."),

    // 인증
    UNAUTHORIZED(401, "인증이 필요합니다."),
    TOKEN_EXPIRED(401, "액세스 토큰이 만료되었습니다."),
    INVALID_TOKEN(401, "유효하지 않은 토큰입니다."),
    FORBIDDEN(403, "접근 권한이 없습니다."),

    // 사용자
    EMAIL_ALREADY_EXISTS(409, "이미 사용 중인 이메일입니다."),
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    INVALID_PASSWORD(401, "비밀번호가 올바르지 않습니다.");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
