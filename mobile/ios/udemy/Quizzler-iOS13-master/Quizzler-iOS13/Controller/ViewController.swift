//
//  ViewController.swift
//  Quizzler-iOS13
//
//  Created by Angela Yu on 12/07/2019.
//  Copyright © 2019 The App Brewery. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var scoreLabel: UILabel!
    @IBOutlet weak var falseBtn: UIButton!
    @IBOutlet weak var trueBtn: UIButton!
    @IBOutlet weak var progressBar: UIProgressView!
    @IBOutlet weak var questionText: UILabel!
    
    var quizBrain = QuizBrain()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        updateQuestion()
        trueBtn.layer.cornerRadius = 20
        falseBtn.layer.cornerRadius = 20
    }

    @IBAction func btnClicked(_ sender: UIButton) {
        let userAnswer = sender.currentTitle!
        
        if quizBrain.isCorrectAnswer(answer: userAnswer) {
            sender.backgroundColor = .green
        } else {
            sender.backgroundColor = .red
        }
        
        quizBrain.goToNextQuestion()
        
        Timer.scheduledTimer(withTimeInterval: 0.2, repeats: false) { Timer in
            sender.backgroundColor = nil
            self.updateQuestion()
        }
    }
    
    func updateQuestion() {
        self.questionText.text = self.quizBrain.getQuestion().text
        self.progressBar.progress = self.quizBrain.getProgress()
        self.scoreLabel.text = "Score: \(self.quizBrain.score)"
    }
}

