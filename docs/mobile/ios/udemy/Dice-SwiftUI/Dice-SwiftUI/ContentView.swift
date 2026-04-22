//
//  ContentView.swift
//  Dice-SwiftUI
//
//  Created by KinHyunJin on 5/1/25.
//

import SwiftUI

struct ContentView: View {
    
    @State var leftDiceNumber = 1
    @State var rightDiceNumber = 2
    
    var body: some View {
        ZStack {
            Image("background")
                .resizable()
                .ignoresSafeArea()
            
            VStack {
                Image("diceeLogo")
                Spacer()
                HStack {
                    DiceView(n: leftDiceNumber)
                    DiceView(n: rightDiceNumber)
                }.padding(.horizontal)
                Spacer()
                Button(action: {
                    leftDiceNumber = Int.random(in: 1...6)
                    rightDiceNumber = Int.random(in: 1...6)
                }) {
                    Text("ROLL")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                        .padding()
                }.background(.red)
                    .cornerRadius(20)
                    .padding()
                    
                
                
            }
        }
    }
}

struct DiceView: View {
    
    let n: Int
    
    var body: some View {
        Image("dice\(n)").resizable()
            .aspectRatio(1, contentMode: .fit)
    }
}

#Preview {
    ContentView()
}
