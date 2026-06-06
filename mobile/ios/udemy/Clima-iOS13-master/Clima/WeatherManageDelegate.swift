//
//  WeatherManageDelegate.swift
//  Clima
//
//  Created by KinHyunJin on 4/12/25.
//  Copyright © 2025 App Brewery. All rights reserved.
//

import Foundation

protocol WeatherManagerDelegate {
    func didUpdateWeather(weather: WeatherModel)
    
    func didFailWithError(error: Error)
}
