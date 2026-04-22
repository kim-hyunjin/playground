//
//  ViewController.swift
//  CameraPhotoLibrary
//
//  Created by 김현진 on 2021/05/15.
//

import UIKit
import MobileCoreServices

class ViewController: UIViewController, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    
    let imagePicker: UIImagePickerController! = UIImagePickerController()
    var captureImage: UIImage!
    var videoURL: URL!
    var flagImageSave = false // 이미지 저장 여부를 나타낼 변수
    
    @IBOutlet var imgView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    func myAlert(_ title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let action = UIAlertAction(title: "OK", style: .default, handler: nil)
        alert.addAction(action)
        self.present(alert, animated: true, completion: nil)
    }
    
    // 사용자가 사진이나 비디오를 촬영하거나 포토라이브러리에서 선택이 끝났을 때 호출되는 메서드
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        
        let mediaType = info[UIImagePickerController.InfoKey.mediaType] as! NSString
        let imageType = kUTTypeImage as NSString
        let videoType = kUTTypeMovie as NSString
        
        switch mediaType {
        case imageType:
            captureImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage
            
            if flagImageSave {
                UIImageWriteToSavedPhotosAlbum(captureImage, self, nil, nil)
            }
            
            imgView.image = captureImage
        case videoType:
            if flagImageSave {
                videoURL = info[UIImagePickerController.InfoKey.mediaURL] as? URL
                UISaveVideoAtPathToSavedPhotosAlbum(videoURL.relativePath, self, nil, nil)
            }
        default:
            print("이미지 또는 비디오 타입이 아님")
        }
//        if mediaType.isEqual(to: kUTTypeImage as NSString as String) {
//            captureImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage
//
//            if flagImageSave {
//                UIImageWriteToSavedPhotosAlbum(captureImage, self, nil, nil)
//            }
//
//            imgView.image = captureImage
//
//        } else if mediaType.isEqual(to: kUTTypeMovie as NSString as String) {
//            if flagImageSave {
//                videoURL = info[UIImagePickerController.InfoKey.mediaURL] as! URL
//                UISaveVideoAtPathToSavedPhotosAlbum(videoURL.relativePath, self, nil, nil)
//            }
//        }
        
        self.dismiss(animated: true, completion: nil) // 현재의 뷰 컨트롤러(이미지 피커 화면)를 제거
    }
    
    // 사용자가 사진이나 비디오를 찍지 않고 취소하거나 선택하지 않고 취소를 하는 경우 호출
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        self.dismiss(animated: true, completion: nil) // 현재의 뷰 컨트롤러(이미지 피커 화면)를 제거
    }
    
    @IBAction func btnCaptureImageFromCamera(_ sender: UIButton) {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            myAlert("Camera inaccessable", message: "Application cannot access the camera.")
            return
        }
        
        flagImageSave = true
        
        imagePicker.delegate = self
        imagePicker.sourceType = .camera
        imagePicker.mediaTypes = [kUTTypeImage as String]
        imagePicker.allowsEditing = false
        
        present(imagePicker, animated: true, completion: nil)
    }
    
    @IBAction func btnLoadImageFromLibrary(_ sender: UIButton) {
        guard UIImagePickerController.isSourceTypeAvailable(.photoLibrary) else {
            myAlert("Photo album inaccesable", message: "Application cannot access the photo album")
            return
        }
        
        flagImageSave = false
        
        imagePicker.delegate = self
        imagePicker.sourceType = .photoLibrary
        imagePicker.mediaTypes = [kUTTypeImage as String]
        imagePicker.allowsEditing = true
        
        present(imagePicker, animated: true, completion: nil)
    }
    
    @IBAction func btnRecordVideoFromCamera(_ sender: UIButton) {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            myAlert("Camera inaccessable", message: "Application cannot access the camera.")
            return
        }
        
        flagImageSave = true
        
        imagePicker.delegate = self
        imagePicker.sourceType = .camera
        imagePicker.mediaTypes = [kUTTypeMovie as String]
        imagePicker.allowsEditing = false
        
        present(imagePicker, animated: true, completion: nil)
    }
    
    @IBAction func btnLoadVideoFromLibrary(_ sender: UIButton) {
        guard UIImagePickerController.isSourceTypeAvailable(.photoLibrary) else {
            myAlert("Photo album inaccesable", message: "Application cannot access the photo album")
            return
        }
        
        flagImageSave = false
        
        imagePicker.delegate = self
        imagePicker.sourceType = .photoLibrary
        imagePicker.mediaTypes = [kUTTypeMovie as String]
        imagePicker.allowsEditing = false
        
        present(imagePicker, animated: true, completion: nil)
    }
    
}

