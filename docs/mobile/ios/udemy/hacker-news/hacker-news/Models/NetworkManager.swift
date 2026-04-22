//
//  NetworkManager.swift
//  hacker-news
//
//  Created by KinHyunJin on 5/1/25.
//

import Foundation

class NetworkManager: ObservableObject {
    
    @Published var posts = [Post]()
    
    func fetchData() {
        do {
            let decoder = JSONDecoder()
            let result = try decoder.decode(Results.self, from: jsonData)
            DispatchQueue.main.async {
                self.posts = result.hits
            }
        } catch {
            print("Error decoding data: \(error)")
        }
        
        //        if let url = URL(string: "https://hn.algolia.com/api/v1/search?tags=front_page") {
        //            let session = URLSession(configuration: .default)
        //            let task = session.dataTask(with: url) { data, response, error in
        //                if error != nil {
        //                    print("Error fetching data: \(error!)")
        //                    return
        //                }
        //
        //                if let safeData = data {
        //                    do {
        //                        print(String(data: safeData, encoding: .utf8) ?? "nil")
        //                        let decoder = JSONDecoder()
        //                        let result = try decoder.decode(Results.self, from: safeData)
        //                        print(result.hits)
        //                        DispatchQueue.main.async {
        //                            self.posts = result.hits
        //                        }
        //                        
        //
        //                    } catch {
        //                        print("Error decoding data: \(error)")
        //                    }
        //                }
        //            }
        //            task.resume()
        //        }
    }
}
