//
//  ViewController.swift
//  MapView
//
//  Created by 김현진 on 2021/05/08.
//

import UIKit
import MapKit

class ViewController: UIViewController, CLLocationManagerDelegate {

    @IBOutlet var myMap: MKMapView!
    @IBOutlet var lblLocationInfo1: UILabel!
    @IBOutlet var lblLocationInfo2: UILabel!
    
    let locationManager = CLLocationManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        setLabel(label1: "", label2: "")
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest // 위치 정확도를 최고로 설정
        locationManager.requestWhenInUseAuthorization() // 위치 데이터를 추적하기 위해 사용자에게 승인 요구
        locationManager.startUpdatingLocation()
        myMap.showsUserLocation = true
    }
    
    // 레이블 설정
    func setLabel(label1: String, label2: String) {
        lblLocationInfo1.text = label1
        lblLocationInfo2.text = label2
    }
    
    // 맵뷰의 위치 설정
    func goLocation(latitude: CLLocationDegrees, longitude: CLLocationDegrees, delta span: Double) -> CLLocationCoordinate2D {
        let pLocation = CLLocationCoordinate2DMake(latitude, longitude)
        let spanValue = MKCoordinateSpan(latitudeDelta: span, longitudeDelta: span)
        let pRegion = MKCoordinateRegion(center: pLocation, span: spanValue)
        myMap.setRegion(pRegion, animated: true)
        
        return pLocation
    }
    
    // 위치 정보에서 국가, 지역, 도로를 추출하여 레이블에 표시
    func extractAdress(location: CLLocation) {
        CLGeocoder().reverseGeocodeLocation(location, completionHandler: { (placemarks, error) -> Void in
            let pm = placemarks!.first
            let country = pm!.country
            var adress: String = country!
            if pm!.locality != nil {
                adress += " "
                adress += pm!.locality!
            }
            if pm!.thoroughfare != nil {
                adress += " "
                adress += pm!.thoroughfare! // 도로정보
            }
            self.setLabel(label1: "현재 위치", label2: adress)
        })
    }
    
    // 특정 위도와 경도에 핀을 설치하고 타이틀과 서브타이틀을 표시
    func setAnnotation(latitude: CLLocationDegrees, longitude: CLLocationDegrees, delta span: Double, title strTitle: String, subtitle strSubtitle: String) {
        
        let annotaion = MKPointAnnotation()
        annotaion.coordinate = goLocation(latitude: latitude, longitude: longitude, delta: span)
        annotaion.title = strTitle
        annotaion.subtitle = strSubtitle
        myMap.addAnnotation(annotaion)
        
    }
    
    // 위치 정보가 업데이트될 때 작업수행
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // 위치가 업데이트되면 먼저 마지막 위치 값을 찾아낸다
        let pLocation = locations.last
        
        // delta 값은 지도의 크기를 정한다. 0.01은 지도를 100배로 확대해서 보여줄 것이다.
        _ = goLocation(latitude: (pLocation?.coordinate.latitude)!, longitude: (pLocation?.coordinate.longitude)!, delta: 0.01)
        
        extractAdress(location: pLocation!)
        locationManager.stopUpdatingLocation()
    }

    @IBAction func sgChangeLocation(_ sender: UISegmentedControl) {
        switch sender.selectedSegmentIndex {
        case 0:
            setLabel(label1: "", label2: "")
            locationManager.startUpdatingLocation()
        case 1:
            setAnnotation(latitude: 37.751853, longitude: 128.87605740000004, delta: 1, title: "한국폴리텍대학 강릉캠퍼스", subtitle: "강원도 강릉시 남산초교길 121")
            setLabel(label1: "보고 계신 위치", label2: "한국폴리텍대학 강릉캠퍼스")
        case 2:
            setAnnotation(latitude: 37.556876, longitude: 126.914066, delta: 0.1, title: "이지스퍼블리싱", subtitle: "서울시 마포구 잔다리로 109 이지스 빌딩")
            setLabel(label1: "보고 계신 위치", label2: "이지스퍼블리싱 출판사")
        default:
            return
        }
    }
    
}

