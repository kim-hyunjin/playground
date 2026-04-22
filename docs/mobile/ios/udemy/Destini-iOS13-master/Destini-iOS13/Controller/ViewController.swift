//
//  ViewController.swift
//  Destini-iOS13
//
//  Created by Angela Yu on 08/08/2019.
//  Copyright © 2019 The App Brewery. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var storyLabel: UILabel!
    @IBOutlet weak var choice1Button: UIButton!
    @IBOutlet weak var choice2Button: UIButton!
    
    var storyBrain = StoryBrain()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        updateStory()
    }
    
    func updateStory() {
        let story = storyBrain.currentStory
        displayLabel(story: story)
        displayOptions(story: story)
    }
    
    func displayLabel(story: Story) {
        storyLabel.text = story.title
    }
    
    func displayOptions(story: Story) {
        choice1Button.setTitle(story.choice1, for: UIControl.State.normal)
        choice2Button.setTitle(story.choice2, for: UIControl.State.normal)
    }
    
    
    
    @IBAction func choiceMade(_ sender: UIButton) {
        guard let choice = sender.titleLabel?.text! else { return }
        
        storyBrain.nextStory(userChoice: choice)
        updateStory()
    }
    
}

