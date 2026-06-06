package com.github.kimhyunjin.architecturepattern.mvi

/**
 * 상태 변경을 요청할 수 있는 액션 정의
 */
sealed class MviIntent {
    data object LoadImage: MviIntent()
}