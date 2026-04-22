package com.github.kimhyunjin.chattingapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.github.kimhyunjin.chattingapp.databinding.ActivityLoginBinding
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.ktx.messaging

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.signUpButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()
            if (email.isEmpty() || password.isEmpty()) {
                showMessage("이메일 또는 패스워드가 입력되지 않았습니다.")
                return@setOnClickListener
            }
            Firebase.auth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this) {
                    if (it.isSuccessful) {
                        showMessage("회원가입에 성공했습니다.")
                    } else {
                        showMessage("회원가입에 실패했습니다.")
                    }
                }
        }

        binding.signInButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()
            if (email.isEmpty() || password.isEmpty()) {
                showMessage("이메일 또는 패스워드가 입력되지 않았습니다.")
                return@setOnClickListener
            }
            Firebase.auth.signInWithEmailAndPassword(email, password).addOnCompleteListener(this) {
                val currentUser = Firebase.auth.currentUser
                if (it.isSuccessful && currentUser != null) {

                    Firebase.messaging.token.addOnCompleteListener { task ->
                        val token = task.result
                        val user = mutableMapOf<String, Any>()
                        user["userId"] = currentUser.uid
                        user["username"] = email
                        user["fcmToken"] = token

                        Firebase.database(Key.DB_URL).reference.child(Key.DB_USERS)
                            .child(currentUser.uid).updateChildren(user)

                        val intent = Intent(this, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    }


                } else {
                    Log.e("LoginActivity", it.exception.toString())
                    showMessage("로그인에 실패했습니다.")
                }
            }
        }
    }

    private fun showMessage(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }
}