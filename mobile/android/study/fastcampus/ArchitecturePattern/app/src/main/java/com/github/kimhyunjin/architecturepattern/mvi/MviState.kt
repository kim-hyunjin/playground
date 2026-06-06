package com.github.kimhyunjin.architecturepattern.mvi

import com.github.kimhyunjin.architecturepattern.mvi.model.Image

/**
 * 상속을 제한, 유한한 개수의 하위 클래스 정의
 *
 * sealed class를 사용하면 자식 클래스를 모두 정의한 상태에서 when 표현식 등을 이용하여 패턴 매칭을 할 때,
 * 모든 자식 클래스에 대한 분기를 명시적으로 작성하지 않아도 됩니다.
 */
sealed class MviState {
    data object Idle: MviState()
    data object Loading: MviState()
    data class LoadedImage(val image: Image, val count: Int): MviState()
}