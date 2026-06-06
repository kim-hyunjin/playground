//
//  WebView.swift
//  hacker-news
//
//  Created by KinHyunJin on 5/1/25.
//
import Foundation
import SwiftUI
import WebKit

// UIViewRepresentable 이 프로토콜을 채택하면 UIKit의 뷰를 SwiftUI 뷰처럼 쓸 수 있게 해줍니다.
struct WebView: UIViewRepresentable {
    var urlString: String?
    
    /**
     SwiftUI가 뷰를 처음 생성할 때 호출됩니다.
     UIViewType은 이 경우 WKWebView입니다.
     */
    func makeUIView(context: Context) -> WebView.UIViewType {
        return WKWebView()
    }
    
    /**
     SwiftUI가 상태가 변경되거나 새로 고침이 필요할 때 지속적으로 호출됩니다.
     */
    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let safeURL = urlString {
            if let url = URL(string: safeURL) {
                let request = URLRequest(url: url)
                uiView.load(request)
            }
        }
            
    }
}
