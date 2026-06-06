//
//  ViewController.swift
//  Xylophone
//
//  Created by Angela Yu on 28/06/2019.
//  Copyright © 2019 The App Brewery. All rights reserved.
//

import UIKit
import AVFoundation

class ViewController: UIViewController {
    var audioPlayer: AVAudioPlayer?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @IBAction func btnPressed(_ sender: UIButton) {
        sender.alpha = 0.5
        UIView.animate(withDuration: 0.2) { sender.alpha = 1 }
        playSound(named: sender.currentTitle!)
    }
    
    func playSound(named fileName: String) {
        // sounds 폴더의 경로를 가져옴
        guard let soundURL = Bundle.main.url(forResource: fileName, withExtension: "wav") else {
            print("파일을 찾을 수 없습니다: \(fileName)")
            return
        }

        do {
            // AVAudioPlayer 초기화
            audioPlayer = try AVAudioPlayer(contentsOf: soundURL)
            audioPlayer?.play()
        } catch {
            print("오디오 플레이어 초기화 중 오류 발생: \(error)")
        }
    }
}
