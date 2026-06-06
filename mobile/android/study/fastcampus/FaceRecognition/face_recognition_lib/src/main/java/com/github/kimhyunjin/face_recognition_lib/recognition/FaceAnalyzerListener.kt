package com.github.kimhyunjin.face_recognition_lib.recognition

import android.graphics.PointF
import android.graphics.RectF
import android.util.SizeF

interface FaceAnalyzerListener {
    /**
     * 얼굴 인식 시작
     */
    fun detect()

    /**
     * 얼굴 인식 종료
     */
    fun stopDetect()

    /**
     * 얼굴 인식이 안 되었을 때
     */
    fun notDetect()

    /**
     * 얼굴 인식 진행도
     */
    fun detectProgress(progress: Float, message: String)

    fun faceSize(rectF: RectF, sizeF: SizeF, pointF: PointF)
}