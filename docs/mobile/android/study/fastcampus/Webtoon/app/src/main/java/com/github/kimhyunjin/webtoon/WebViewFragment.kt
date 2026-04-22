package com.github.kimhyunjin.webtoon

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.core.content.edit
import com.github.kimhyunjin.webtoon.databinding.FragmentWebViewBinding

private const val URL = "param1"
private const val POSITION = "param2"

const val SHARED_PREFERENCE_KEY = "WEB_HISTORY"

fun getSharedPreferenceTabNameKey(position: Int): String {
    return "tab${position}_name"
}

class WebViewFragment : Fragment() {
    var listener: OnTabNameChangeListener? = null
    private var url: String? = null
    private var position: Int? = null
    private val sharedPreferenceUrlKey: String
        get() {
            return "tab$position"
        }
    private val sharedPreferenceTabNameKey: String
        get() {
            return getSharedPreferenceTabNameKey(position!!)
        }

    private lateinit var binding: FragmentWebViewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            url = it.getString(URL)
            position = it.getInt(POSITION)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentWebViewBinding.inflate(inflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.webView.webViewClient = WebtoonWebViewClient(binding) { url ->
            activity?.getSharedPreferences(SHARED_PREFERENCE_KEY, Context.MODE_PRIVATE)?.edit {
                putString(sharedPreferenceUrlKey, url)
            }
        }
        binding.webView.settings.javaScriptEnabled = true
        if (url != null) {
            binding.webView.loadUrl(url!!)
        }

        binding.btnBackToLast.setOnClickListener {
            val sharedPreference =
                activity?.getSharedPreferences(SHARED_PREFERENCE_KEY, Context.MODE_PRIVATE)
            val url = sharedPreference?.getString(sharedPreferenceUrlKey, "")
            if (url.isNullOrEmpty()) {
                Toast.makeText(context, "마지막 저장 URL이 없습니다.", Toast.LENGTH_SHORT).show()
            } else {
                binding.webView.loadUrl(url)
            }
        }

        binding.btnChangeTabName.setOnClickListener {
            val editText = EditText(context)
            AlertDialog.Builder(context).apply {
                setView(editText)
                setPositiveButton("저장") { _, _ ->
                    activity?.getSharedPreferences(SHARED_PREFERENCE_KEY, Context.MODE_PRIVATE)?.edit {
                        putString(sharedPreferenceTabNameKey, editText.text.toString())
                        if (position != null) {
                            listener?.onNameChanged(position!!, editText.text.toString())
                        }
                    }
                }
                setNegativeButton("취소") { dialog, _ ->
                    dialog.cancel()
                }
            }.show()
        }
    }

    fun canGoBack(): Boolean {
        return binding.webView.canGoBack()
    }

    fun goBack() {
        binding.webView.goBack()
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param url 웹뷰에 로드할 url
         * @return A new instance of fragment WebViewFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(url: String, position: Int, onTabNameChangeListener: OnTabNameChangeListener) =
            WebViewFragment().apply {
                arguments = Bundle().apply {
                    putString(URL, url)
                    putInt(POSITION, position)
                }
                listener = onTabNameChangeListener
            }
    }

    interface OnTabNameChangeListener {
        fun onNameChanged(position: Int, name: String)
    }
}