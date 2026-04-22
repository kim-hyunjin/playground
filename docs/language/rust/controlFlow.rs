fn main() {
    if 1 == 2 {
        println!("whoops, mathematics broke");
    } else {
        println!("everything's fine!");
    }

    /*
        대부분의 언어와 달리 if 블록은 식으로 동작할 수도 있습니다. 코드가 컴파일되려면 모든 분기는 동일한 형식을 반환해야 합니다.
    */
    let formal = true;
    let greeting = if formal {
        "Good evening."
    } else {
        "Hello, friend!"
    };
    println!("{}", greeting); // prints "Good evening."

    // Rust에 있는 다른 종류의 루프(예: While 및 for)와 달리 break를 통해 값을 반환하는 식에 loop를 사용할 수 있습니다.
    let mut i = 1;
    let something = loop {
        i *= 2;
        if i > 100 {
            break i;
        }
    };
    assert_eq!(something, 128);

    // while
    let mut counter = 0;
    
    while counter < 10 {
        println!("hello");
        counter = counter + 1;
    }

    // for 
    let a = [10, 20, 30, 40, 50];

    for element in a.iter() { // .iter()와 같은 메서드를 호출하여 반복기를 생성할 수 있는 값도 있습니다.
        println!("The value is: {}", element);
    }

    for item in 0..5 { // 반복기를 만드는 또 다른 쉬운 방법은 a..b 범위 표기법을 사용하는 것입니다. 이 표기법은 a(포함)에서 b(제외)까지의 값을 한 단계로 생성합니다.
        println!("{}", item * 2);
    }
}