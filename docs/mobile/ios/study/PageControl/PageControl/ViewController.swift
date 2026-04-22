//
//  ViewController.swift
//  PageControl
//
//  Created by 김현진 on 2021/05/08.
//

import UIKit

class ViewController: UIViewController {
    var images: [UIImage?] = []
    
    @IBOutlet var imgView: UIImageView!
    @IBOutlet var pageControl: UIPageControl!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        initImages()
        initPageControl()
        setSwipeGesture()
        setPinchGesture()
        imgView.image = images[0]
    }
    
    private func initImages() {
        for i in 1...6 {
            images.append(UIImage(named: "0\(i).png"))
        }
    }
    
    private func initPageControl() {
        pageControl.numberOfPages = images.count
        pageControl.currentPage = 0
        pageControl.pageIndicatorTintColor = UIColor.green
        pageControl.currentPageIndicatorTintColor = UIColor.red
    }
    
    private func setSwipeGesture() {
        let swipeLeft = UISwipeGestureRecognizer(target: self, action: #selector(ViewController.respondToSwipeGesture(_:)))
        swipeLeft.direction = UISwipeGestureRecognizer.Direction.left
        self.view.addGestureRecognizer(swipeLeft)
        
        let swipeRight = UISwipeGestureRecognizer(target: self, action: #selector(ViewController.respondToSwipeGesture(_:)))
        swipeRight.direction = UISwipeGestureRecognizer.Direction.right
        self.view.addGestureRecognizer(swipeRight)
    }
    
    private func setPinchGesture() {
        let pinch = UIPinchGestureRecognizer(target: self, action: #selector(ViewController.doPinch(_:)))
        self.view.addGestureRecognizer(pinch)
    }
    
    @objc func respondToSwipeGesture(_ gesture: UIGestureRecognizer) {
        guard let swipeGesture = gesture as? UISwipeGestureRecognizer else {
            return
        }
        
        switch swipeGesture.direction {
        case .right:
            pageControl.currentPage = pageControl.currentPage > 0 ? pageControl.currentPage - 1 : 0
            imgView.image = images[pageControl.currentPage]
        case .left:
            pageControl.currentPage = pageControl.currentPage < images.count ? pageControl.currentPage + 1 : images.count
            imgView.image = images[pageControl.currentPage]
        default:
            break
        }
    }
    
    @objc func doPinch(_ pinch: UIPinchGestureRecognizer) {
        imgView.transform = imgView.transform.scaledBy(x: pinch.scale, y: pinch.scale)
        pinch.scale = 1
    }

    @IBAction func pageChange(_ sender: UIPageControl) {
        imgView.image = images[pageControl.currentPage]
    }
    
}

