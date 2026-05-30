Rust의 *prelude*는 “매번 `use` 하지 않아도 기본으로 가져와지는 이름들의 모음”이라고 보면 돼.

쉽게 말하면:

> **자주 쓰니까 컴파일러가 미리 `use` 해주는 것들**

---

## 왜 필요한가?

예를 들어 `Vec`, `Option`, `Result` 같은 건 너무 자주 쓰잖아.

매 파일마다 이렇게 쓰면 귀찮겠지:

```rust
use std::vec::Vec;
use std::option::Option;
use std::result::Result;
```

그래서 Rust는 이런 걸 자동으로 스코프에 넣어줘.

덕분에 그냥 바로:

```rust
let numbers = Vec::new();

let value: Option<i32> = Some(1);

fn parse() -> Result<(), String> {
    Ok(())
}
```

이렇게 쓸 수 있어.

---

## 실제로 뭐가 들어있나?

대표적으로 `std::prelude`에 이런 것들이 포함돼.

```rust
Option::{self, Some, None}
Result::{self, Ok, Err}
Vec
String
Box
Clone
Copy
Drop
Default
Iterator
IntoIterator
From
Into
AsRef
Eq
Ord
Fn
FnMut
FnOnce
```

전부는 아니지만 체감상 많이 만나는 것들.

---

## prelude의 위치

보통은:

```rust
std::prelude::v1
```

이걸 Rust가 자동으로 import 해줌.

`no_std` 환경이면:

```rust
core::prelude::v1
```

이 들어오고.

---

## 내가 직접 prelude 만들 수도 있나?

가능함. Rust 라이브러리에서 흔한 패턴이야.

예를 들면:

```rust
// prelude.rs
pub use crate::Parser;
pub use crate::Error;
pub use crate::Config;
```

그리고 사용자에게:

```rust
use mylib::prelude::*;
```

하게 만드는 식.

그러면:

```rust
use mylib::prelude::*;

let parser = Parser::new();
```

처럼 필요한 타입들을 한 번에 가져올 수 있음.

---

## 왜 `prelude::*`는 괜찮다고 하나?

보통 wildcard import는 남발하면 안 좋다고 하잖아.

```rust
use foo::*;
```

근데 `prelude::*`는 관례적으로 허용되는 편이야.

이유는:

* 라이브러리 제작자가 “자주 쓰는 것만” 골라 넣음
* 사용자가 뭘 가져오는지 대략 예상 가능
* ergonomics가 좋아짐

그래서 많이 보게 됨:

```rust
use tokio::prelude::*;
```

혹은

```rust
use futures::prelude::*;
```

---

## 한 가지 헷갈리는 점

`Vec`는 바로 쓰는데 왜 `HashMap`은 `use` 해야 하지?

```rust
use std::collections::HashMap;
```

이건 prelude에 없기 때문.

Rust는 정말 **엄청 자주 쓰는 것만** 넣어둬.

`HashMap`은 자주 쓰이긴 하지만 모든 코드에서 필수는 아니라서 빠져 있음.

---

요약하면:

| 질문                      |                          답 |
| ----------------------- | -------------------------: |
| prelude가 뭐야?            | 자동 import되는 기본 타입/trait 모음 |
| 누가 제공해?                 |    `std`, `core`, 혹은 라이브러리 |
| 왜 쓰나?                   |           boilerplate 줄이려고 |
| 직접 만들 수 있나?             |                         가능 |
| `Vec`는 왜 import 안 해도 돼? |               prelude에 있어서 |
| `HashMap`은 왜 해야 돼?      |               prelude에 없어서 |

Rust 처음 보면 `Vec`은 되는데 `HashMap` 안 돼서 여기서 많이 헷갈려 😄
