//
//  ViewController.swift
//  EggTimer
//
//  Created by Angela Yu on 08/07/2019.
//  Copyright © 2019 The App Brewery. All rights reserved.
//

import UIKit
import AVFoundation

class ViewController: UIViewController {
    
    @IBOutlet weak var progressBar: UIProgressView!
    @IBOutlet weak var titleLabel: UILabel!
    
    let eggTimes = ["Soft": 5, "Medium": 7, "Hard": 12]
    
    var eggDoneTime: Int?
    var countdownTimer = 0
    var timer: Timer?
    var audioPlayer: AVAudioPlayer?

    @IBAction func eggClicked(_ sender: UIButton) {
        countdownTimer = eggTimes[sender.currentTitle!]!
        eggDoneTime = countdownTimer
        startTimer()
    }
    
    func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
                    if self.countdownTimer >= 0 {
                        self.titleLabel.text = "\(self.countdownTimer)"
                        if let maxTime = self.eggDoneTime {
                            self.progressBar.progress = Float(maxTime - self.countdownTimer) / Float(maxTime)
                        }
                        
                        self.countdownTimer -= 1
                    } else {
                        self.playSound(fileName: "alarm_sound")
                        timer.invalidate()
                        self.titleLabel.text = "Done!"
                    }
                }
    }
    
    func playSound(fileName: String) {
            // Get the file path from the bundle
            guard let filePath = Bundle.main.path(forResource: fileName, ofType: "mp3") else {
                print("File not found")
                return
            }

            let fileURL = URL(fileURLWithPath: filePath)

            do {
                // Initialize the audio player
                audioPlayer = try AVAudioPlayer(contentsOf: fileURL)
                audioPlayer?.play()
            } catch {
                print("Error playing audio: \(error)")
            }
        }
    
}
