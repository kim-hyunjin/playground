package com.example.kidsdrawingapp

import android.content.Context
import android.graphics.*
import android.util.TypedValue
import android.view.MotionEvent
import android.view.View

class DrawingView(context: Context): View(context) {
    private lateinit var mDrawPath: CustomPath
    private lateinit var mCanvasBitmap: Bitmap
    private lateinit var mDrawPaint: Paint
    private lateinit var mCanvasPaint: Paint
    /**
     * A variable for canvas which will be initialized later and used.
     *
     *The Canvas class holds the "draw" calls. To draw something, you need 4 basic components: A Bitmap to hold the pixels, a Canvas to host
     * the draw calls (writing into the bitmap), a drawing primitive (e.g. Rect,
     * Path, text, Bitmap), and a paint (to describe the colors and styles for the
     * drawing)
     */
    private lateinit var mCanvas: Canvas
    private var mBrushSize: Float = 0f
    private var mColor: Int = Color.BLACK
    private var mPaths = ArrayList<CustomPath>()
    private var mUndoPaths = ArrayList<CustomPath>()

    init {
        setupDrawing()
    }

    /**
     * This method is called when either the brush or the eraser
     * sizes are to be changed. This method sets the brush/eraser
     * sizes to the new values depending on user selection.
     */
    fun setSizeForBrush(newSize: Float) {
        // 화면 크기를 고려
        mBrushSize = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, newSize, resources.displayMetrics)
        mDrawPaint.strokeWidth = mBrushSize
    }

    /**
     * This function is called when the user desires a color change.
     * This functions sets the color of a store to selected color and able to draw on view using that color.
     *
     * @param color
     */
    fun setColorForBrush(color: Int) {
        mColor = color
    }

    fun undoPath() {
        if (mPaths.size > 0) {
            mUndoPaths.add(mPaths.removeAt(mPaths.size - 1))
            invalidate()
        }
    }
    fun redoPath() {
        if (mUndoPaths.size > 0) {
            mPaths.add(mUndoPaths.removeAt(mUndoPaths.size - 1))
            invalidate()
        }

    }

    private fun setupDrawing() {
        mDrawPath = CustomPath(mColor, mBrushSize)

        mDrawPaint = Paint()
        mDrawPaint.color = mColor
        mDrawPaint.style = Paint.Style.STROKE
        mDrawPaint.strokeJoin = Paint.Join.ROUND
        mDrawPaint.strokeCap = Paint.Cap.ROUND

        mCanvasPaint = Paint(Paint.DITHER_FLAG)
//        mBrushSize = 20f
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        mCanvasBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        mCanvas = Canvas(mCanvasBitmap)
    }

    /**
     * This method is called when a stroke is drawn on the canvas
     * as a part of the painting.
     */
    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        canvas?.drawBitmap(mCanvasBitmap, 0f, 0f, mCanvasPaint)

        drawPreviousPaths(canvas)

        mDrawPaint.strokeWidth = mDrawPath.brushThickness
        mDrawPaint.color = mDrawPath.color
        canvas?.drawPath(mDrawPath, mDrawPaint)
    }

    /**
     * This method acts as an event listener when a touch
     * event is detected on the device.
     */
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        val touchX = event?.x
        val touchY = event?.y

        when(event?.action) {
            MotionEvent.ACTION_DOWN -> {
                setPathWithUserSetting()
                mDrawPath.moveTo(touchX!!, touchY!!)
            }
            MotionEvent.ACTION_MOVE -> {
                mDrawPath.lineTo(touchX!!, touchY!!)
            }
            MotionEvent.ACTION_UP -> {
                savePathAndPrepareNewPath()
            } else -> {
                return false
            }
        }

        invalidate()
        return true
    }

    private fun drawPreviousPaths(canvas: Canvas?) {
        if (canvas == null) return

        for (path in mPaths) {
            mDrawPaint.strokeWidth = path.brushThickness
            mDrawPaint.color = path.color
            canvas.drawPath(path, mDrawPaint)
        }
    }
    private fun setPathWithUserSetting() {
        mDrawPath.brushThickness = mBrushSize
        mDrawPath.color = mColor
        // mDrawPath.reset() // why should I call this?
    }
    private fun savePathAndPrepareNewPath() {
        mPaths.add(mDrawPath)
        mDrawPath = CustomPath(mColor, mBrushSize)
    }

    internal inner class CustomPath(var color: Int, var brushThickness: Float): Path() {

    }
}