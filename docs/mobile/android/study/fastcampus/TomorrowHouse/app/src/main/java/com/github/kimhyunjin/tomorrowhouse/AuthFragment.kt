package com.github.kimhyunjin.tomorrowhouse

import android.os.Bundle
import android.view.View
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import com.github.kimhyunjin.tomorrowhouse.databinding.FragmentAuthBinding
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.auth

class AuthFragment: Fragment(R.layout.fragment_auth) {

    private lateinit var binding: FragmentAuthBinding
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentAuthBinding.bind(view)

        setupSignUpButton()
        setupSignInOutButton()
    }

    override fun onStart() {
        super.onStart()
        if (Firebase.auth.currentUser == null) {
            initViewToSignOutState()
        } else {
            initViewToSignInState()
        }
    }

    private fun setupSignInOutButton() {
        binding.signInOutButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (Firebase.auth.currentUser == null) {
                // 로그인
                if (email.isEmpty() || password.isEmpty()) {
                    Snackbar.make(binding.root, "이메일과 패스워드를 입력해주세요.", Snackbar.LENGTH_SHORT).show()
                    return@setOnClickListener
                }

                Firebase.auth.signInWithEmailAndPassword(email, password).addOnCompleteListener { task ->
                    if (task.isSuccessful) {

                        initViewToSignInState()
                    } else {
                        Snackbar.make(binding.root, "로그인에 실패했습니다. 이메일 또는 패스워드를 확인해주세요.", Snackbar.LENGTH_SHORT).show()
                    }
                }

            } else {
                // 로그아웃
                Firebase.auth.signOut()
                initViewToSignOutState()
            }
        }
    }

    private fun setupSignUpButton() {
        binding.signupButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                Snackbar.make(binding.root, "이메일과 패스워드를 입력해주세요.", Snackbar.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            Firebase.auth.createUserWithEmailAndPassword(email, password).addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    initViewToSignInState()
                    Snackbar.make(binding.root, "회원가입에 성공했습니다.", Snackbar.LENGTH_SHORT).show()
                } else {
                    Snackbar.make(binding.root, "회원가입에 실패했습니다.", Snackbar.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun initViewToSignInState() {
        binding.emailEditText.setText(Firebase.auth.currentUser?.email)
        binding.emailEditText.isEnabled = false
        binding.passwordEditText.isVisible = false
        binding.signInOutButton.text = getString(R.string.signOut)
        binding.signupButton.isEnabled = false
    }

    private fun initViewToSignOutState() {
        binding.emailEditText.text.clear()
        binding.emailEditText.isEnabled = true
        binding.passwordEditText.text.clear()
        binding.passwordEditText.isVisible = true
        binding.signInOutButton.text = getString(R.string.signIn)
        binding.signupButton.isEnabled = true
    }
}