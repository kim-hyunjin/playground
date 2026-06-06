//
//  DetailViewController.swift
//  TableView
//
//  Created by 김현진 on 2021/05/13.
//

import UIKit

class DetailViewController: UIViewController {
    
    var receiveItem = ""

    @IBOutlet var lblItem: UILabel!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        lblItem.text = receiveItem
    }
    
    func receiveItem(_ item: String) {
        receiveItem = item
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
