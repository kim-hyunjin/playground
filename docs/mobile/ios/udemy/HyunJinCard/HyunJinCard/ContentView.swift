//
//  ContentView.swift
//  HyunJinCard
//
//  Created by KinHyunJin on 5/1/25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Color(.green)
                .edgesIgnoringSafeArea(.all)
            VStack {
                Image("IMG_6483")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 150)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.white, lineWidth: 5))
                    .shadow(radius: 10)
                Text("HyunJin Kim")
                    .font(Font.custom("Tagesschrift-Regular", size: 40))
                    .bold()
                    .foregroundColor(.white)
                Text("iOS Developer")
                    .foregroundColor(.white)
                    .font(.system(size: 25))
                Divider()
                InfoView(imageName: "phone.fill", text: "+82 10 1234 5678")
                InfoView(imageName: "envelope.fill", text: "hyunjin1612@gmail.com")
            }
        }
        
    }
}

#Preview {
    ContentView()
}


