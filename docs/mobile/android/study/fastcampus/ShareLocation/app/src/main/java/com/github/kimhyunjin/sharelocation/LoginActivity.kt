package com.github.kimhyunjin.sharelocation

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.github.kimhyunjin.sharelocation.databinding.ActivityLoginBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.auth
import com.google.firebase.database.database
import com.kakao.sdk.auth.AuthApiClient
import com.kakao.sdk.auth.model.OAuthToken
import com.kakao.sdk.common.KakaoSdk
import com.kakao.sdk.common.model.ClientError
import com.kakao.sdk.common.model.ClientErrorCause
import com.kakao.sdk.user.UserApiClient
import com.kakao.sdk.user.model.User

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var emailLoginResult: ActivityResultLauncher<Intent>
    private var pendingUser: User? = null
    private val TAG = "kakao"

    // 카카오계정으로 로그인 공통 callback 구성
    // 카카오톡으로 로그인 할 수 없어 카카오계정으로 로그인할 경우 사용됨
    private val callback: (OAuthToken?, Throwable?) -> Unit = { token, error ->
        if (error != null) {
            Log.e(TAG, "카카오계정으로 로그인 실패", error)
            showErrorToast()
            error.printStackTrace()
        } else if (token != null) {
            Log.i(TAG, "카카오계정으로 로그인 성공 ${token.accessToken}")
            getKakaoAccountInfo()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Kakao SDK 초기화
        KakaoSdk.init(this, "1fee26e3619c1a35f974d497df14516f")

        if (AuthApiClient.instance.hasToken()) {
            UserApiClient.instance.accessTokenInfo { tokenInfo, error ->
                if (error == null) {
                    getKakaoAccountInfo()
                }
            }
        }

        emailLoginResult =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
                if (it.resultCode == RESULT_OK) {
                    val email = it.data?.getStringExtra("email")
                    if (email == null) {
                        showErrorToast()
                        return@registerForActivityResult
                    } else {
                        if (pendingUser != null) {
                            tryToSignInFirebase(pendingUser!!, email)
                        }
                    }
                }
            }

        binding.kakaoLoginButton.setOnClickListener {

            // 카카오톡이 설치되어 있으면 카카오톡으로 로그인, 아니면 카카오계정으로 로그인
            if (UserApiClient.instance.isKakaoTalkLoginAvailable(this)) {
                UserApiClient.instance.loginWithKakaoTalk(this) { token, error ->
                    if (error != null) {
                        Log.e(TAG, "카카오톡으로 로그인 실패", error)

                        // 사용자가 카카오톡 설치 후 디바이스 권한 요청 화면에서 로그인을 취소한 경우,
                        // 의도적인 로그인 취소로 보고 카카오계정으로 로그인 시도 없이 로그인 취소로 처리 (예: 뒤로 가기)
                        if (error is ClientError && error.reason == ClientErrorCause.Cancelled) {
                            return@loginWithKakaoTalk
                        }

                        // 카카오톡에 연결된 카카오계정이 없는 경우, 카카오계정으로 로그인 시도
                        UserApiClient.instance.loginWithKakaoAccount(this, callback = callback)
                    } else if (token != null) {
                        Log.i(TAG, "카카오톡으로 로그인 성공 ${token.accessToken}")
                        if (Firebase.auth.currentUser == null) {
                            // 카카오톡에서 정보를 가져와 파이어베이스 로그인
                            getKakaoAccountInfo()
                        } else {
                            navigateToMapActivity()
                        }
                    }
                }
            } else {
                UserApiClient.instance.loginWithKakaoAccount(this, callback = callback)
            }
        }
    }

    private fun getKakaoAccountInfo() {
        UserApiClient.instance.me { user, error ->
            if (error != null) {
                showErrorToast()
                error.printStackTrace()
            } else if (user != null) {
                Log.i(
                    "LoginActivity",
                    "user: ${user.id} / email: ${user.kakaoAccount?.email} / nickname: ${user.kakaoAccount?.profile?.nickname} / profile_photo: ${user.kakaoAccount?.profile?.profileImageUrl}"
                )

                checkKakaoUserData(user)
            }
        }
    }

    private fun showErrorToast() {
        Toast.makeText(this, "사용자 로그인에 실패했습니다.", Toast.LENGTH_SHORT).show()
    }

    private fun checkKakaoUserData(user: User) {
        val kakaoEmail = user.kakaoAccount?.email.orEmpty()

        if (kakaoEmail.isEmpty()) {
            // 추가로 이메일을 받는 작업
            pendingUser = user
            emailLoginResult.launch(Intent(this, EmailActivity::class.java))
            return
        }

        tryToSignInFirebase(user, kakaoEmail)
    }

    private fun tryToSignInFirebase(user: User, email: String) {
        val uid = user.id.toString()

        Firebase.auth.createUserWithEmailAndPassword(email, uid).addOnCompleteListener {
            if (it.isSuccessful) {
                updateFirebaseUserInfo(user)
            }
        }.addOnFailureListener { firebaseCreateUserError ->
            if (firebaseCreateUserError is FirebaseAuthUserCollisionException) {
                // 이미 가입된 계정 - 로그인 시도
                signInFirebase(user, email, uid)
            } else {
                showErrorToast()
                firebaseCreateUserError.printStackTrace()
            }
        }
    }

    private fun signInFirebase(user: User, email: String, password: String) {
        Firebase.auth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener { authResult ->
                if (authResult.isSuccessful) {
                    updateFirebaseUserInfo(user)
                } else {
                    showErrorToast()
                }
            }.addOnFailureListener { error ->
                showErrorToast()
                error.printStackTrace()
            }
    }

    private fun updateFirebaseUserInfo(user: User) {
        val uid = Firebase.auth.currentUser?.uid.orEmpty()

        val userMap = mutableMapOf<String, Any>()
        userMap["uid"] = uid
        userMap["name"] = user.kakaoAccount?.profile?.nickname.orEmpty()
        userMap["profilePhoto"] = user.kakaoAccount?.profile?.profileImageUrl.orEmpty()

        Firebase.database.reference.child("Person").child(uid).updateChildren(userMap)

        navigateToMapActivity()
    }

    private fun navigateToMapActivity() {
        startActivity(Intent(this, MapActivity::class.java))
    }
}