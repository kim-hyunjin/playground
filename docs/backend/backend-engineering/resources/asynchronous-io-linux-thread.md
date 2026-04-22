# Re: [PATCH 09/13] aio: add support for async openat()

> **출처**: LWN.net — *News from the source*
> **게재일**: 2016년 1월 12일 (corbet 작성)

---

## 메일 헤더

| 항목 | 내용 |
|------|------|
| **From** | Linus Torvalds `<torvalds@linux-foundation.org>` |
| **To** | Benjamin LaHaise `<bcrl@kvack.org>`, Ingo Molnar `<mingo@kernel.org>` |
| **Subject** | Re: [PATCH 09/13] aio: add support for async openat() |
| **Date** | Mon, 11 Jan 2016 16:22:28 -0800 |
| **Message-ID** | `<CA+55aFw8j_3Vkb=HVoMwWTPD=5ve8RpNZeL31CcKQZ+HRSbfTA@mail.gmail.com>` |
| **Cc** | linux-aio, linux-fsdevel, Linux Kernel Mailing List, Linux API, linux-mm, Alexander Viro, Andrew Morton |

---

## 본문

### 발단: LaHaise의 패치 요약

> *Benjamin LaHaise가 제안한 내용*:
> 메모리에 없는 파일을 열 때와 같이 블로킹이 발생하는 경우, 스레드 기반의 AIO 헬퍼를 사용하여 `IOCB_CMD_OPENAT`에 대한 비동기 지원을 추가한다.

---

### Linus Torvalds의 답변

#### AIO 인터페이스에 대한 비판

Linus는 이 접근 방식이 **지나치게 지저분하다(ridiculously ugly)**고 밝혔습니다.

- **AIO는 원래부터 설계가 나빴다**: 다른 사람들이 만든 ad-hoc 설계였고, 데이터베이스 개발자들의 호환성 요구로 인해 어쩔 수 없이 구현된 것이다.
- **임의적인 확장 방식 반대**: 시스템 콜 하나씩 특수하게 추가하는 방식으로 AIO 인터페이스를 확장하는 것은 바람직하지 않다.

---

#### Linus가 제안하는 대안: "범용 비동기 시스템 콜" 인터페이스

Linus는 기존 AIO 모델이 아닌, **완전히 새로운 비동기 시스템 콜 인터페이스**를 제안했습니다.

**핵심 아이디어**:

- 단순히 "커널 스레드를 사용하여 임의의 시스템 콜 X를 인자 A, B, C, D와 함께 비동기적으로 실행"하는 형태
- 이런 인터페이스라면 많은 사람들이 사용할 것이고, `read()`, `write()` 같은 일반 시스템 콜에도 적용 가능

**구체적인 설계 제안**:

1. 진정한 **비동기 시스템 콜 인터페이스** 추가
2. 각 항목마다 **futex 완료 통지**가 있는 시스템 콜 목록 형태로 구성 → 쉽게 결과를 대기할 수 있음
3. *(선택적)* 한 시스템 콜의 결과를 다음 시스템 콜에 전달하는 파이프라인 방식 지원

**파이프라인 예시**:

```c
fd  = openat(..);
ret = read(fd, ..);
// 위 두 작업을 비동기로 실행하고 read() 완료를 기다림
```

---

#### LaHaise 패치의 좋은 부분

Linus는 비록 전체적인 방향에는 반대하지만, 커널 스레드 관련 부분은 범용 구현에 유용하다고 평가했습니다.

- `AIO_THREAD_NEED_CRED` 등의 로직은 타당함
- 스레드로 작업을 처리할 때 몇 가지 atomic 연산 비용은 크지 않으므로 **무조건적으로 적용해도 무방**할 것으로 봄

---

#### Ingo Molnar에 대한 언급

Linus는 과거 Ingo Molnar가 시스템 콜 오버헤드를 줄이기 위해 **"시스템 콜 목록 실행"** 패치를 작성한 것을 기억하며 CC에 추가했습니다.

- 단순 오버헤드 감소 목적만으로는 흥미롭지 않았지만, **비동기 실행** 개념이 더해지면 훨씬 매력적인 아이디어가 될 수 있다고 봄

---

## 요약

| 항목 | 내용 |
|------|------|
| **문제 제기** | AIO 인터페이스에 `openat()` 비동기 지원을 추가하는 패치 |
| **Linus의 반응** | AIO 자체가 나쁜 설계이므로, 이를 확장하는 것도 나쁜 방향 |
| **대안 제안** | 범용 비동기 시스템 콜 인터페이스 (`임의의 syscall을 비동기로 큐잉`) |
| **장기 목표** | 반대로 AIO를 범용 비동기 인터페이스 위에 구현할 수도 있음 |

---

*Copyright © 2016, Eklektix, Inc. — Linux is a registered trademark of Linus Torvalds*
