package com.notequiz.common.response;

import com.notequiz.common.exception.ErrorCode;

public record ErrorResponse(String code, String message, int status) {

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(errorCode.name(), errorCode.getMessage(), errorCode.getStatus());
    }

    public static ErrorResponse of(String code, String message, int status) {
        return new ErrorResponse(code, message, status);
    }
}
