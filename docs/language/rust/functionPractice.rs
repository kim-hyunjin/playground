fn is_divisible_by(dividend: u32, divisor: u32) -> bool {

    // If the divisor is zero, we want to return early with a `false` value
    if divisor == 0 {
        return false;
    }

    // Rust에서는 항상 코드 블록({ ... }) 내의 마지막 식이 반환되므로 여기서는 return 키워드를 사용할 필요가 없습니다.
    dividend % divisor == 0
}

fn main() {
    assert_eq!(is_divisible_by(2, 3), false);
    assert_eq!(is_divisible_by(5, 1), true);
    assert_eq!(is_divisible_by(17, 0), false);
    assert_eq!(is_divisible_by(24, 6), true);
}