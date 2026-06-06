//
//  ViewController.swift
//  ImageViewer
//
//  Created by 김현진 on 2021/05/06.
//

import UIKit

class ViewController: UIViewController {
    var photos: [UIImage?] = []
    var currentPhotosIndex = 0
    
    @IBOutlet var imgBox: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        photos.append(UIImage(named: "1.png"))
        photos.append(UIImage(named: "2.png"))
        photos.append(UIImage(named: "3.png"))
        photos.append(UIImage(named: "4.png"))
        photos.append(UIImage(named: "5.png"))
        photos.append(UIImage(named: "6.png"))
        imgBox.image = photos[currentPhotosIndex]
    }

    @IBAction func btnShowPrevPhoto(_ sender: UIButton) {
        if currentPhotosIndex > 0 {
            currentPhotosIndex -= 1
            imgBox.image = photos[currentPhotosIndex]
        }
    }
    
    @IBAction func btnShowNextPhoto(_ sender: UIButton) {
        if currentPhotosIndex < photos.endIndex - 1 {
            currentPhotosIndex += 1
            imgBox.image = photos[currentPhotosIndex]
        }
    }
    
}

