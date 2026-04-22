package com.github.kimhyunjin.myquizapp

import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.setMargins

class QuizQuestionActivity : AppCompatActivity() {
    lateinit var tvQuestion: TextView
    lateinit var progressBar: ProgressBar
    lateinit var tvProgress: TextView
    lateinit var ivImage: ImageView
    lateinit var optionContainer: LinearLayout
    lateinit var btnSubmit: Button

    private val optionViewLayoutParam = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT)

    private lateinit var questionList: ArrayList<Question>
    private lateinit var optionViewList: ArrayList<TextView>
    private var mUserName: String? = null
    private var currentQuestionIndex = 0
    private var selectedOptionIndex: Int? = null
    private var correctAnswerCount = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_quiz_question)

        tvQuestion = findViewById(R.id.tv_question)
        progressBar = findViewById(R.id.progressBar)
        tvProgress = findViewById(R.id.tv_progress)
        ivImage = findViewById(R.id.iv_image)
        optionContainer = findViewById(R.id.optionContainer)
        btnSubmit = findViewById(R.id.btn_submit)

        questionList = Constants.getQuestions()
        progressBar.max = questionList.size
        mUserName = intent.getStringExtra(Constants.USER_NAME)

        createQuestionView(questionList[currentQuestionIndex])
    }

    private fun createQuestionView(question: Question) {
        tvQuestion.text = question.question
        progressBar.progress = currentQuestionIndex + 1
        tvProgress.text = getString(R.string.tv_progress, currentQuestionIndex + 1, progressBar.max)
        ivImage.setImageResource(question.image)
        createOptionsView(question.options)
        btnSubmit.text = "SUBMIT"
        btnSubmit.setOnClickListener {
            answerView()
        }
    }

    private fun createOptionsView(options: List<String>) {
        optionContainer.removeAllViews()
        optionViewList = ArrayList()
        selectedOptionIndex = null

        for (i in 0 until options.count()) {
            val tv = TextView(this)
            tv.id = i
            tv.text = options[i]
            tv.textSize = 18f
            tv.gravity = Gravity.CENTER
            tv.setPadding(15, 15,15, 15)
            tv.setBackgroundResource(R.drawable.default_option_border_bg)
            tv.setTextColor(Color.parseColor("#7A8089"))
            tv.setOnClickListener {
                selectOption(i)
            }
            optionViewLayoutParam.setMargins(10)
            optionContainer.addView(tv, optionViewLayoutParam)
            optionViewList.add(tv)
        }
    }

    private fun selectOption(optionIndex: Int) {
        selectedOptionIndex = optionIndex

        for (i in 0 until optionViewList.size) {
            val tv = optionViewList[i]
            if (i == selectedOptionIndex) {
                tv.setTextColor(Color.parseColor("#363A43"))
                tv.setTypeface(tv.typeface, Typeface.BOLD)
                tv.setBackgroundResource(R.drawable.selected_option_border_bg)
            } else {
                tv.setTextColor(Color.parseColor("#7A8089"))
                tv.typeface = Typeface.DEFAULT
                tv.setBackgroundResource(R.drawable.default_option_border_bg)
            }
        }
    }

    private fun answerView() {
        if (selectedOptionIndex == null) {
            Toast.makeText(this, "Please select answer", Toast.LENGTH_LONG).show()
            return
        }

        val correctAnswer = questionList[currentQuestionIndex].answer
        val selectedOptionView = optionViewList[selectedOptionIndex!!]
        val correctOptionView = optionViewList[correctAnswer]
        correctOptionView.setBackgroundResource(R.drawable.correct_option_border_bg)
        with(selectedOptionView) {
            if (selectedOptionIndex == correctAnswer) {
                correctAnswerCount++
            } else {
                setBackgroundResource(R.drawable.wrong_option_border_bg)
            }
        }

        with(btnSubmit) {
            if (currentQuestionIndex + 1 == questionList.size) {
                text = "FINISH"
                setOnClickListener {
                    Toast.makeText(context, "You made it to the end!", Toast.LENGTH_LONG).show()
                    val intent = Intent(context, ResultActivity::class.java)
                    intent.putExtra(Constants.USER_NAME, mUserName)
                    intent.putExtra(Constants.TOTAL_CNT, questionList.size)
                    intent.putExtra(Constants.CORRECT_CNT, correctAnswerCount)
                    startActivity(intent)
                    finish()
                }
            } else {
                text = "GO TO NEXT QUESTION"
                setOnClickListener {
                    createQuestionView(questionList[++currentQuestionIndex])
                }
            }
        }

        for (tvOption in optionViewList) {
            tvOption.setOnClickListener(null)
        }

    }
}