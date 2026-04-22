//
//  DetailView.swift
//  hacker-news
//
//  Created by KinHyunJin on 5/1/25.
//

import SwiftUI

struct DetailView: View {
    
    let url: String?
    
    var body: some View {
        WebView(urlString: url)
            
    }
}


#Preview {
    DetailView(url: "https://www.google.com")
}
