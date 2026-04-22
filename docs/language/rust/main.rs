// A struct with named fields
struct Person {
    name: String,
    age: u8,
    likes_oranges: bool,
}

// A tuple struct
struct Point2D(u32, u32);

// A unit struct
struct Unit;

enum WebEvent {
    PageLoad,
    PageUnload,
    KeyPress(KeyPress),
    Paste(String),
    Click(Click)
}

struct Click { 
    x: i64, 
    y: i64 
}

struct KeyPress(char);

fn main() {
    let a_number = 10;
    let a_boolean = true;

    // !는 함수를 일반적인 메서드가 아닌 매크로로 사용하고 있음을 Rust에 알립니다.
    // 가변 개수의 인수를 포함하는 함수로 간주할 수 있습니다.
    println!("The number is {}.", a_number);
    println!("The boolean is {}.", a_boolean);

    // 가변성
    // Rust에서는 기본적으로 변수 바인딩을 변경할 수 없습니다.
    // a_number = 15; // ==> 에러

    // 값을 변경하려면 mut 키워드를 사용하여 변수 바인딩을 변경할 수 있도록 설정해야 합니다.
    let mut b_number = 10;
    println!("The number is {}.", b_number);
    b_number = 15;
    println!("Now the number is {}.", b_number);
    
    // 섀도잉
    // 이전 변수와 이름이 같은 새 변수를 선언하여 새 바인딩을 만들 수도 있습니다.
    // 새 변수는 이전 변수를 섀도잉합니다. 이전 변수는 여전히 존재하지만 이 범위에서는 더 이상 참조할 수 없습니다.
    
    let number = 5;
    let number = number + 5;
    let number = number * 2;
    println!("The number is {}.", number); // 20

    // str과 String
    // str은 문자열 데이터의 뷰. 대부분의 경우 &str 형식을 사용.
    // &str을 변경할 수 없는 문자열에 대한 포인터로 생각할 수 있다.
    // String은 변경될 수 있는 문자열 데이터. 힙에 할당된다.

    // Create a String from a string literal
    let mut hello = String::from("Hello, ");  

    // Push a character into our String
    hello.push('w');
    
    // Push a string literal into our String       
    hello.push_str("orld!");
             
    println!("{}", hello);

    // 튜플
    // 튜플은 하나의 복합으로 수집되는 다양한 형식의 값을 그룹화한 것이다.
    // 고정길이를 가진다. 즉, 선언된 후 크기를 늘리거나 줄일 수 없다.
    // 튜플의 형식은 각 멤버의 형식 시퀀스로 정의된다.
    let tuple = ("hello", 5i32, 'c'); //(&'static str, i32, char)

    // assert_eq! 매크로는 두 식이 서로 같은지 확인합니다.
    assert_eq!(tuple.0, "hello");
    assert_eq!(tuple.1, 5);
    assert_eq!(tuple.2, 'c');

    println!("{}", tuple.0);  // prints "hello"

    // 구조체
    // Instantiate a classic struct, with named fields. Order does not matter.
    let person = Person {
        name: String::from("Adam"),
        likes_oranges: true,
        age: 25
    };

    // Instantiate a tuple struct by passing the values in the same order as defined.
    let _origin = Point2D(0, 0);

    // Instantiate a unit struct.
    let _unit = Unit;

    // Display the details of the person
    if person.likes_oranges {
        println!("{:?} is {:?} and likes oranges.", person.name, person.age);  
    } else {
        println!("{:?} is {:?} and doesn't like oranges.", person.name, person.age);  
    }
}
