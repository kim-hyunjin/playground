package com.github.kimhyunjin.securitykeypad.widget

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.View
import android.widget.GridLayout
import android.widget.TextView
import androidx.core.view.children
import com.github.kimhyunjin.securitykeypad.databinding.WidgetShuffleNumberKeypadBinding
import kotlin.random.Random

class ShuffleNumberKeypad @JvmOverloads constructor(
    context: Context, attributeSet: AttributeSet? = null, defStyleAttr: Int = 0
) : GridLayout(context, attributeSet, defStyleAttr), View.OnClickListener {

    private var _binding: WidgetShuffleNumberKeypadBinding? = null

    private val binding get() = _binding!!

    private var listener: KeypadListener? = null

    init {
        _binding =
            WidgetShuffleNumberKeypadBinding.inflate(LayoutInflater.from(context), this, true)
        binding.view = this
        binding.clickListener = this
        shuffle()
    }

    // View의 경우 databinding을 사용하는 경우, 화면에서 뷰가 사라졌을 때 명시적으로 databinding에 대한 참조를 끊어줘야한다.
    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        _binding = null
    }

    override fun onClick(v: View) {
        if (v is TextView && v.tag != null) {
            listener?.onClickNum(v.text.toString())
        }
    }

    fun setKeypadListener(listener: KeypadListener) {
        this.listener = listener
    }

    fun onClickDelete() {
        listener?.onClickDelete()
    }

    fun onClickDone() {
        listener?.onClickDone()
    }

    private fun shuffle() {
        val numberArr = ArrayList<String>()
        for (i in 0..9) {
            numberArr.add(i.toString())
        }

        binding.gridLayout.children.forEach { view ->
            if (view is TextView && view.tag != null) {
                val randIndex = Random.nextInt(numberArr.size)
                view.text = numberArr[randIndex]
                numberArr.removeAt(randIndex)
            }
        }
    }

    interface KeypadListener {
        fun onClickNum(num: String)
        fun onClickDelete()
        fun onClickDone()
    }


}