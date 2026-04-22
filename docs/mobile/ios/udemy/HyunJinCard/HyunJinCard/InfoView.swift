//
//  InfoView.swift
//  HyunJinCard
//
//  Created by KinHyunJin on 5/1/25.
//

import SwiftUI

struct InfoView: View {
    
    var imageName: String
    var text: String
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 25)
                .fill(Color.white)
                .frame(width: 300, height: 50)
            HStack {
                Image(systemName: imageName)
                    .foregroundColor(.green)
                Text(text).foregroundColor(Color("Info Color"))
                    
            }
            
        }
    }
}

#Preview(traits: .sizeThatFitsLayout) {
    InfoView(imageName: "phone.fill", text: "+82 10 1234 5678")
}
