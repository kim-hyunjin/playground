package com.github.kimhyunjin.facerecognition

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.DashPathEffect
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PathMeasure
import android.graphics.PointF
import android.graphics.PorterDuff
import android.graphics.PorterDuffXfermode
import android.graphics.RectF
import android.util.AttributeSet
import android.util.SizeF
import android.view.View

class FaceOverlayView @JvmOverloads constructor(
    context: Context,
    attributeSet: AttributeSet? = null,
    defStyleAtt: Int = 0
) : View(context, attributeSet, defStyleAtt) {

    private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.BLACK
        alpha = 90
        style = Paint.Style.FILL
    }

    // 얼굴형 회색 스트로크
    private val facePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.GRAY
        style = Paint.Style.STROKE
        strokeWidth = 10f
        pathEffect = DashPathEffect(floatArrayOf(10f, 10f), 0f)
    }

    // 가운데 구멍내기
    private val maskPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        xfermode = PorterDuffXfermode(PorterDuff.Mode.DST_OUT)
    }

    private val progressPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.YELLOW
        style = Paint.Style.STROKE
        strokeWidth = 10f
    }

    private val facePath = Path()
    private var progress = 0f

    // 얼굴형 custom UI 그리기
    fun setSize(rectF: RectF, sizeF: SizeF, centerF: PointF) {
        val topOffset = sizeF.width / 2
        val bottomOffset = sizeF.width / 5 // 아래쪽이 더 갸름

        with(facePath) {
            reset()
            // 오른쪽 반원
            moveTo(centerF.x, rectF.top)
            cubicTo(
                rectF.right + topOffset,
                rectF.top,
                rectF.right + bottomOffset,
                rectF.bottom,
                centerF.x,
                rectF.bottom
            )
            // 왼쪽 반원
            cubicTo(
                rectF.left - bottomOffset,
                rectF.bottom,
                rectF.left - topOffset,
                rectF.top,
                centerF.x,
                rectF.top
            )
            close()
        }
        postInvalidate()
    }

    fun setProgress(progress: Float) {
        // 현재 progress ~ 다음 progress까지 500ms에 걸쳐 업데이트
        ValueAnimator.ofFloat(this.progress, progress).apply {
            duration = ANIMATE_DURATION
            addUpdateListener {
                this@FaceOverlayView.progress = it.animatedValue as Float
                // invalidate시 다시 onDraw 호출
                invalidate()
            }
        }.start()
    }

    fun reset() {
        facePath.reset()
        progress = 0f
        invalidate()
    }


    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        drawOverlay(canvas)
        drawProgress(canvas)
    }

    private fun drawOverlay(canvas: Canvas) {
        canvas.drawRect(0f, 0f, canvas.width.toFloat(), canvas.height.toFloat(), backgroundPaint)
        canvas.drawPath(facePath, maskPaint)
        canvas.drawPath(facePath, facePaint)
    }

    private fun drawProgress(canvas: Canvas) {
        // facePath의 길이 구하기
        val measure = PathMeasure(facePath, true)
        val pathLength = measure.length
        // progress %만큼 dash 그리기
        val total = pathLength - (pathLength * (progress / 100))
        val pathEffect = DashPathEffect(floatArrayOf(pathLength, pathLength), total)
        progressPaint.pathEffect = pathEffect
        canvas.drawPath(facePath, progressPaint)
    }

    companion object {
        private const val ANIMATE_DURATION = 500L
    }
}