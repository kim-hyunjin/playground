fn main() {
    /*
        배열

        배열의 길이는 고정되어 있습니다. 배열의 모든 요소는 동일한 형식이어야 합니다.
        배열은 다음과 같은 두 가지 방법으로 정의할 수 있습니다.
        - 대괄호 안의 쉼표로 구분된 목록
        - 초기 값; 대괄호로 묶은 배열의 길이
    */
    // Comma-separated list inside brackets
    let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    println!("First weekday is {}", weekdays[0]); 
  
    // Initialize an array of 512 elements where every element is a zero
    let byte_buffer = [0_u8; 512];
    println!("Buffer element 100 is {}", byte_buffer[99]);

    // 배열은 힙이 아닌 스택에 데이터를 할당하려는 경우에 유용합니다. 또한 항상 고정된 수의 요소를 유지하려는 경우에 유용합니다.


    /*
        벡터

        배열과 마찬가지로 Vec<T> 형식으로 벡터를 사용하여 동일한 형식의 여러 값을 저장할 수 있습니다.
        배열과 달리 벡터는 언제든지 커지거나 작아질 수 있습니다.
        컴파일 타임에 크기가 알려지지 않음을 의미하므로 Rust에서는 벡터의 잘못된 위치에 액세스하는 문제가 발생할 수 없습니다.
    */
    let three_numbers = vec![1, 2, 3];
    println!("Initial vector: {:?}", three_numbers);  

    // The vec! macro also accepts the same syntax as the array constructor
    let ten_zeroes = vec![0; 10];
    println!("Ten zeroes: {:?}", ten_zeroes); 
    // println! 호출 내에서 콜론 물음표 {:?} 형식 매개 변수를 보셨을 것입니다. 이 매개 변수는 디버깅 을 위해 무언가를 출력하고자 할 때마다 사용됩니다. 

    // 벡터는 Vec::new() 메서드를 사용하여 만들 수도 있습니다.
     let mut new_v = Vec::new();

     new_v.push(5);
     new_v.push(6);
     new_v.push(7);
     new_v.push(8);
     println!("Current vector is {:?}", new_v); 

     new_v.pop();
     println!("Current vector is {:?}", new_v); 
     
     new_v[1] = new_v[1] + 5;
     println!("Current vector is {:?}", new_v); 


     /*
        컬렉션에 대한 마지막 일반적인 구문은 해시 맵입니다. 
        HashMap<K, V> 형식은 K 형식의 키와 V 형식의 값 간 매핑을 저장합니다. 
        벡터가 정수 인덱스로 값을 저장하는 반면, 해시 맵은 키로 값을 저장합니다.     
        힙에 데이터를 저장하고, 런타임에 해당 항목에 대한 액세스를 확인합니다.
        HashMap::new 메서드를 사용해 빈 해시 맵을 만들 수 있습니다.
        HashMap::insert 메서드를 통해 요소를 추가할 수 있습니다.
     */
    use std::collections::HashMap; // 표준 라이브러리의 collections 부분에서 HashMap을 사용해야 한다
    
    let mut book_reviews: HashMap<String, String> = HashMap::new();
    
    // Add book reviews
    book_reviews.insert(
        "Adventures of Huckleberry Finn".to_string(), // 문자열 리터럴(&str) 값을 String으로 변환합니다. 해시맵이 값을 참조가 아닌 "소유"하도록 하려는 경우에 유용합니다.
        "My favorite book.".to_string(),
    );
    book_reviews.insert(
        "Grimms' Fairy Tales".to_string(),
        "Masterpiece.".to_string(),
    );
    book_reviews.insert(
        "Pride and Prejudice".to_string(),
        "Very enjoyable.".to_string(),
    );
    book_reviews.insert(
        "The Adventures of Sherlock Holmes".to_string(),
        "Eye lyked it alot.".to_string(),
    );

    if !book_reviews.contains_key("Les Misérables") {
        println!("{} reviews found. No reviews found for Les Misérables.", book_reviews.len());
    }

    /*
        해시 맵은 참조를 사용하여 기존 항목을 쿼리할 수 있습니다. 
        즉, 해시 맵의 형식이 HashMap<String, String>이더라도 &str 또는 &String 형식을 사용하여 해당 키를 조회할 수 있습니다.
    */
    println!("Review for Tom: {}", book_reviews["Adventures of Huckleberry Finn"]);    
    println!("Review for Jane: {}", book_reviews["Pride and Prejudice"]);
    let sherlock = "The Adventures of Sherlock Holmes";
    println!("Review for Arthur: {}", book_reviews[sherlock]);

    book_reviews.remove(sherlock);
    assert_eq!(book_reviews.contains_key(sherlock), false);

    // Searching for a non-existent key causes a panic - no entry found for key
    // println!("Review for Herman: {}", book_reviews["Moby Dick"]);

    /*
        해시 맵에는 아무런 문제도 발생하지 않고 콘텐츠를 안전하게 쿼리하는 .get() 메서드도 있습니다.
        .remove() 메서드를 사용하여 해시 맵에서 항목을 제거할 수 있습니다.
    */
}