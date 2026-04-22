package com.github.kimhyunjin.securitykeypad

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

/**
 * 문자내용은 140바이트를 초과해선 안된다.
 * 문자 맨 앞에 <#> 이 포함되어야 한다.
 * 맨 마지막에 앱을 식별하는 11글자 해시코드가 필요하다.
 *
 * #Example:
 * <#> [Sample] 본인인증번호 [123456] hashcode123
 */
class AuthOtpReceiver : BroadcastReceiver() {

    private var listener: OtpReceiveListener? = null

    override fun onReceive(context: Context?, intent: Intent) {
        if (intent.action == SmsRetriever.SMS_RETRIEVED_ACTION) {
            intent.extras?.let {
                val status = it.get(SmsRetriever.EXTRA_STATUS) as Status
                when (status.statusCode) {
                    CommonStatusCodes.SUCCESS -> {
                        val otpSms = it.getString(SmsRetriever.EXTRA_SMS_MESSAGE, "")
                        if (listener != null && otpSms.isNotEmpty()) {
                            val otp = PATTERN.toRegex().find(otpSms)?.destructured?.component1()
                            if (!otp.isNullOrEmpty()) {
                                listener!!.onOtpReceive(otp)
                            }
                        }
                    }
                }
            }
        }
    }

    fun setOtpListener(receiveListener: OtpReceiveListener) {
        this.listener = receiveListener
    }

    fun doFilter() = IntentFilter().apply {
        addAction(SmsRetriever.SMS_RETRIEVED_ACTION)
    }

    interface OtpReceiveListener {
        fun onOtpReceive(otp: String)
    }

    companion object {
        private const val PATTERN = "^<#>.*\\[Sample\\].+\\[(\\d{6})\\].+\$"
    }


}