package com.github.kimhyunjin.face_recognition_lib.recognition

import android.graphics.PointF
import android.graphics.RectF
import android.media.Image
import android.util.Log
import android.util.SizeF
import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.view.PreviewView
import androidx.lifecycle.Lifecycle
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import kotlin.math.abs

internal class FaceAnalyzer(
    lifecycle: Lifecycle,
    private val previewView: PreviewView,
    private val listener: FaceAnalyzerListener?
) : ImageAnalysis.Analyzer {

    private var widthScaleFactor = 1f
    private var heightScaleFactor = 1f

    // image 좌우 반전에 사용
    private var preCenterX = 0f
    private var preCenterY = 0f
    private var preWidth = 0f
    private var preHeight = 0f

    private val options = FaceDetectorOptions.Builder()
        .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
        .setContourMode(FaceDetectorOptions.CONTOUR_MODE_ALL) // 윤곽선
        .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL) // 표정도 가져올 수 있도록 설정
        .setMinFaceSize(0.4f)
        .build()

    private val detector = FaceDetection.getClient(options)

    private var detectStatus = FaceAnalyzerStatus.UnDetect

    private val successListener = OnSuccessListener<List<Face>> { faces ->
        val face = faces.firstOrNull()
        // 얼굴 인식 -> 왼쪽 윙크 -> 오른쪽 윙크 -> 스마일 -> 종료
        if (face != null) {
            // 전면 카메라라 좌우가 반전되어 있어서
            // 왼쪽 눈을 감으면 rightEyeOpenProbability 가 낮게 나옴
            // 오른쪽 눈을 감으면 leftEyeOpenProbability 가 낮게 나옴
            // Log.i("Probability", "left ${face.leftEyeOpenProbability} / right ${face.rightEyeOpenProbability}")
            if (detectStatus == FaceAnalyzerStatus.UnDetect) {
                detectStatus = FaceAnalyzerStatus.Detect
                listener?.detect()
                listener?.detectProgress(25f, "얼굴을 인식했습니다. \n왼쪽 눈만 깜빡여주세요.")
            } else if (detectStatus == FaceAnalyzerStatus.Detect
                && (face.leftEyeOpenProbability ?: 0f) > EYE_SUCCESS_VALUE
                && (face.rightEyeOpenProbability ?: 0f) < EYE_SUCCESS_VALUE
            ) {
                detectStatus = FaceAnalyzerStatus.LeftWink
                listener?.detectProgress(50f, "오른쪽 눈만 깜빡여주세요.")
            } else if (detectStatus == FaceAnalyzerStatus.LeftWink
                && (face.leftEyeOpenProbability ?: 0f) < EYE_SUCCESS_VALUE
                && (face.rightEyeOpenProbability ?: 0f) > EYE_SUCCESS_VALUE
            ) {
                detectStatus = FaceAnalyzerStatus.RightWink
                listener?.detectProgress(75f, "활짝 웃어보세요.")
            } else if (detectStatus == FaceAnalyzerStatus.RightWink
                && (face.smilingProbability ?: 0f) > SMILE_SUCCESS_VALUE
            ) {
                detectStatus = FaceAnalyzerStatus.Smile
                listener?.detectProgress(100f, "얼굴 인식이 완료되었습니다.")
                listener?.stopDetect()
                detector.close()
            }
            calculateDetectSize(face)
            // 중간단계에서 얼굴인식 실패시 처음단계로 돌아간다.
        } else if (detectStatus != FaceAnalyzerStatus.UnDetect && detectStatus != FaceAnalyzerStatus.Smile) {
            detectStatus = FaceAnalyzerStatus.UnDetect
            listener?.notDetect()
            listener?.detectProgress(0f, "얼굴을 인식하지 못했습니다. \n처음 단계로 돌아갑니다.")
        }
    }

    private val failureListener = OnFailureListener { e ->
        detectStatus = FaceAnalyzerStatus.UnDetect
    }

    init {
        lifecycle.addObserver(detector)
    }

    override fun analyze(image: ImageProxy) {
        widthScaleFactor = previewView.width.toFloat() / image.width
        heightScaleFactor = previewView.height.toFloat() / image.height
        detectFace(image)
    }

    @OptIn(ExperimentalGetImage::class)
    private fun detectFace(imageProxy: ImageProxy) {
        val image = InputImage.fromMediaImage(
            imageProxy.image as Image,
            imageProxy.imageInfo.rotationDegrees
        )
        detector.process(image).addOnSuccessListener(successListener)
            .addOnFailureListener(failureListener).addOnCompleteListener {
                imageProxy.close()
            }
    }

    /**
     * 얼굴 사이즈 계산, 좌우 반전하여 activity에게 전달
     */
    private fun calculateDetectSize(face: Face) {
        val rect = face.boundingBox
        val boxWidth = rect.right - rect.left
        val boxHeight = rect.bottom - rect.top

        // 얼굴의 왼쪽이 화면상에서는 오른쪽에 있어서 왼쪽의 숫자가 더 큼
        // 따라서 아래의 계산을 통해 좌우를 반전
        val left = rect.right.translateX() - (boxWidth / 2)
        val top = rect.top.translateY() - (boxHeight / 2)
        val right = rect.left.translateX() + (boxWidth / 2)
        val bottom = rect.bottom.translateY()
//        val left = rect.left.toFloat()
//        val right = rect.right.toFloat()
//        val top = rect.top.toFloat()
//        val bottom = rect.bottom.toFloat()
//        Log.i("size", "left ${left}, top ${top}, right ${right}, bottom ${bottom}")

        val width = right - left
        val height = bottom - top
        val centerX = left + width / 2
        val centerY = top + height / 2

        if (abs(preCenterX - centerX) > PIVOT_OFFSET
            || abs(preCenterY - centerY) > PIVOT_OFFSET
            || abs(preWidth - width) > SIZE_OFFSET
            || abs(preHeight - height) > SIZE_OFFSET
        ) {
            listener?.faceSize(
                RectF(left, top, right, bottom),
                SizeF(width, height),
                PointF(centerX, centerY)
            )
            preCenterX = centerX
            preCenterY = centerY
            preWidth = width
            preHeight = height
        }
    }

    private fun Int.translateX() = previewView.width - (toFloat() * widthScaleFactor)
    private fun Int.translateY() = toFloat() * heightScaleFactor

    companion object {
        private const val EYE_SUCCESS_VALUE = 0.1f
        private const val SMILE_SUCCESS_VALUE = 0.8f

        private const val PIVOT_OFFSET = 15
        private const val SIZE_OFFSET = 30
    }
}