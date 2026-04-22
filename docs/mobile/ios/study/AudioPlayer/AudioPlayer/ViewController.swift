//
//  ViewController.swift
//  AudioPlayer
//
//  Created by 김현진 on 2021/05/15.
//

import UIKit
import AVFoundation

class ViewController: UIViewController, AVAudioPlayerDelegate, AVAudioRecorderDelegate {
    
    let MAX_VOLUME: Float = 10.0
    let timePlayerSelector: Selector = #selector(ViewController.updatePlayTime)
    let timeRecordSelector: Selector = #selector(ViewController.updateRecordTime)
    let imgDict: [String:UIImage?] = ["play":UIImage(named: "play.png"), "pause":UIImage(named: "pause.png"), "record":UIImage(named: "record.png"), "stop":UIImage(named: "stop.png")]
    
    var audioPlayer: AVAudioPlayer!
    var audioRecorder: AVAudioRecorder!
    var audioFile: URL!
    var progressTimer: Timer!
    var isRecordMode = false

    @IBOutlet var pvProgressPlay: UIProgressView!
    @IBOutlet var lblCurrentTime: UILabel!
    @IBOutlet var lblEndTime: UILabel!
    @IBOutlet var btnPlay: UIButton!
    @IBOutlet var btnPause: UIButton!
    @IBOutlet var btnStop: UIButton!
    @IBOutlet var slVolume: UISlider!
    @IBOutlet var btnRecord: UIButton!
    @IBOutlet var lblRecordTime: UILabel!
    @IBOutlet var swRecord: UISwitch!
    @IBOutlet var imgView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        selectAudioFile()
        if !isRecordMode {
            initPlay()
            swRecord.setOn(false, animated: true)
            btnRecord.isEnabled = false
            lblRecordTime.isEnabled = false
        } else {
            initRecord()
        }
        
    }
    
    func selectAudioFile() {
        if !isRecordMode {
            audioFile = Bundle.main.url(forResource: "bensound-happyrock", withExtension: "mp3")
        } else {
            let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            audioFile = documentDirectory.appendingPathComponent("recordFile.m4a") // 녹음모드일때 생성할 파일
        }
    }
    
    func initRecord() {
        /*
            포맷: Apple Lossless
            음질: 최대
            비트율: 320,000bps(320kbps)
            오디오채널: 2
            샘플율: 44,100Hz
         */
        let recordSettings = [
            AVFormatIDKey: NSNumber(value: kAudioFormatAppleLossless as UInt32),
            AVEncoderAudioQualityKey: AVAudioQuality.max.rawValue,
            AVEncoderBitRateKey: 320000,
            AVNumberOfChannelsKey: 2,
            AVSampleRateKey: 44100.0
        ] as [String: Any]
        
        do {
            audioRecorder = try AVAudioRecorder(url: audioFile, settings: recordSettings)
        } catch let error as NSError {
            print("Error - initRecord(): \(error)")
        }
        audioRecorder.delegate = self
        
        slVolume.value = 1.0
        audioPlayer.volume = slVolume.value
        lblEndTime.text = convertNSTimeIntervalToString(0)
        lblCurrentTime.text = convertNSTimeIntervalToString(0)
        setPlayButtons(play: false, pause: false, stop: false)
        
        let session = AVAudioSession.sharedInstance()
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch let error as NSError {
            print("Error - initRecord() - setCategory: \(error)")
        }
        do {
            try session.setActive(true)
        } catch let error as NSError {
            print("Error - initRecord() - setActive: \(error)")
        }
    }
    
    func initPlay() {
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: audioFile)
        } catch let error as NSError {
            print("Error - initPlay(): \(error)")
        }
        slVolume.maximumValue = MAX_VOLUME
        slVolume.value = 1.0
        pvProgressPlay.progress = 0
        
        audioPlayer.delegate = self
        audioPlayer.prepareToPlay()
        audioPlayer.volume = slVolume.value
        
        lblEndTime.text = convertNSTimeIntervalToString(audioPlayer.duration)
        lblCurrentTime.text = convertNSTimeIntervalToString(0)
        setPlayButtons(play: true, pause: false, stop: false)
    }
    
    func setPlayButtons(play: Bool, pause: Bool, stop: Bool) {
        btnPlay.isEnabled = play
        btnPause.isEnabled = pause
        btnStop.isEnabled = stop
    }
    
    func convertNSTimeIntervalToString(_ time: TimeInterval) -> String {
        let min = Int(time / 60)
        let sec = Int(time.truncatingRemainder(dividingBy: 60)) // time 값을 60으로 나눈 나머지 값을 정수 값으로 변환
        let strTime = String(format: "%02d:%02d", min, sec)
        return strTime
    }
    
    // 오디오 재생이 끝나면 수행할 함수
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        progressTimer.invalidate()
        setPlayButtons(play: true, pause: false, stop: false)
    }
    
    // 타이머에 의해 0.1초 간격으로 재생시간 업데이트
    @objc func updatePlayTime() {
        lblCurrentTime.text = convertNSTimeIntervalToString(audioPlayer.currentTime)
        pvProgressPlay.progress = Float(audioPlayer.currentTime / audioPlayer.duration)
    }
    
    // 타이머에 의해 0.1초 간격으로 녹음시간 업데이트
    @objc func updateRecordTime() {
        lblRecordTime.text = convertNSTimeIntervalToString(audioRecorder.currentTime)
    }

    @IBAction func btnPalyAudio(_ sender: UIButton) {
        audioPlayer.play()
        setPlayButtons(play: false, pause: true, stop: true)
        progressTimer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: timePlayerSelector, userInfo: nil, repeats: true) // 0.1초 간격으로 타이머 생성
        imgView.image = imgDict["play"]!
    }
    
    @IBAction func btnPauseAudio(_ sender: UIButton) {
        audioPlayer.pause()
        setPlayButtons(play: true, pause: false, stop: true)
        imgView.image = imgDict["pause"]!
    }
    
    @IBAction func btnStopAudio(_ sender: UIButton) {
        audioPlayer.stop()
        audioPlayer.currentTime = 0 // 오디오를 처음부터 재생해야하므로 0으로 설정
        lblCurrentTime.text = convertNSTimeIntervalToString(0)
        setPlayButtons(play: true, pause: false, stop: false)
        progressTimer.invalidate() // 타이머 무효화
        imgView.image = imgDict["stop"]!
    }
    
    @IBAction func slChangeVolume(_ sender: UISlider) {
        audioPlayer.volume = slVolume.value
    }
    
    @IBAction func swRecordMode(_ sender: UISwitch) {
        if sender.isOn {
            audioPlayer.stop()
            audioPlayer.currentTime = 0
            
            isRecordMode = true
            btnRecord.isEnabled = true
            lblRecordTime.isEnabled = true
            lblRecordTime!.text = convertNSTimeIntervalToString(0)
        } else {
            isRecordMode = false
            btnRecord.isEnabled = false
            lblRecordTime.isEnabled = false
            lblRecordTime.text = convertNSTimeIntervalToString(0)
        }
        
        selectAudioFile()
        
        if !isRecordMode {
            initPlay()
        } else {
            initRecord()
        }
    }
    
    @IBAction func btnRecord(_ sender: UIButton) {
        if (sender as AnyObject).titleLabel?.text == "Record" {
            audioRecorder.record()
            (sender as AnyObject).setTitle("Stop", for: UIControl.State())
            progressTimer = Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: timeRecordSelector, userInfo: nil, repeats: true)
            imgView.image = imgDict["record"]!
        } else {
            audioRecorder.stop()
            (sender as AnyObject).setTitle("Record", for: UIControl.State())
            btnPlay.isEnabled = true
            initPlay()
            imgView.image = imgDict["stop"]!
        }
    }
    
}

