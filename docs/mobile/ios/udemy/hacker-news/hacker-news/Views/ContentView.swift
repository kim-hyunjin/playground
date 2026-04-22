//
//  ContentView.swift
//  hacker-news
//
//  Created by KinHyunJin on 5/1/25.
//

import SwiftUI

struct ContentView: View {
    
    @ObservedObject var networkManager = NetworkManager()
    
    var body: some View {
        NavigationView {
            List(networkManager.posts) { post in
                NavigationLink(destination: DetailView(url: post.url)) {
                    HStack {
                        Text("\(post.points)")
                        Text(post.title)
                    }
                }
                
            }.navigationTitle("Hacker News")
        }.onAppear {
            self.networkManager.fetchData()
        }
    }
}


#Preview {
    ContentView()
}
