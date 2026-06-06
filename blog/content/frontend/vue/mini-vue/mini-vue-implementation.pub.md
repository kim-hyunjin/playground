---
title: Vue 3 반응형 시스템 직접 구현해보기 (Mini-Vue)
date: 2026-04-24
category: Frontend
tags: [Vue, Reactivity, JavaScript, Proxy, Design Patterns]
summary: Vue 3의 핵심인 반응형 시스템(ref, reactive, computed, watch)을 바닐라 자바스크립트로 직접 구현하며 원리를 파헤쳐 봅니다.
---

# Vue 3 반응형 시스템 직접 구현해보기 (Mini-Vue)

Vue 3의 가장 강력한 특징은 바로 **Composition API**와 이를 뒷받침하는 **반응형(Reactivity) 시스템**입니다. `ref`, `reactive`, `computed`, `watch` 등이 내부적으로 어떻게 동작하는지 궁금해 본 적이 있나요? 

이번 포스트에서는 `track`과 `trigger`라는 핵심 메커니즘을 중심으로 Mini-Vue를 직접 구현해 보며 그 원리를 깊이 있게 이해해 보겠습니다.

---

### 1. 핵심 메커니즘: 의존성 추적 (track)과 실행 (trigger)

반응형 시스템의 심장은 **의존성 관리**입니다. 특정 데이터를 누가 사용하는지 기록하고(`track`), 데이터가 변하면 그 기록을 바탕으로 관련 작업들을 다시 실행(`trigger`)하는 구조입니다.

- **activeEffect**: 현재 실행 중인 효과(함수)를 담는 전역 변수입니다.
- **targetMap**: 모든 반응형 객체의 의존성을 저장하는 거대한 지도로, `WeakMap`을 사용하여 메모리 누수를 방지합니다.

```javascript
let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key) {
    if (!activeEffect) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (!dep) return;
    dep.forEach(effect => {
        if (effect !== activeEffect) effect();
    });
}
```

---

### 2. ref와 reactive: 데이터에 반응성 입히기

데이터에 접근할 때 `track`을 호출하고, 값을 수정할 때 `trigger`를 호출하도록 가로채야 합니다.

- **ref**: 단일 값(원시값 포함)을 위해 `getter`와 `setter`를 가진 객체를 사용합니다.
- **reactive**: 객체 전체를 위해 JavaScript의 `Proxy`를 사용합니다.

```javascript
export function ref(initialValue) {
    let _value = initialValue;
    const r = {
        get value() {
            track(r, 'value');
            return _value;
        },
        set value(newVal) {
            if (newVal !== _value) {
                _value = newVal;
                trigger(r, 'value');
            }
        }
    };
    return r;
}

export function reactive(target) {
    return new Proxy(target, {
        get(obj, key) {
            track(obj, key);
            return obj[key];
        },
        set(obj, key, value) {
            obj[key] = value;
            trigger(obj, key);
            return true;
        }
    });
}
```

---

### 3. computed: 계산된 속성과 캐싱

`computed`는 의존하는 값이 변할 때만 다시 계산되어야 합니다. 이를 위해 `dirty`라는 플래그를 사용하여 캐싱을 구현합니다.

```javascript
export function computed(getter) {
    let value;
    let dirty = true;

    const computedRef = {
        get value() {
            track(computedRef, 'value');
            if (dirty) {
                dirty = false;
                activeEffect = effectFn;
                value = getter();
                activeEffect = null;
            }
            return value;
        }
    };

    const effectFn = () => {
        dirty = true;
        trigger(computedRef, 'value');
    };

    activeEffect = effectFn;
    getter(); // 초기 의존성 수집
    activeEffect = null;

    return computedRef;
}
```

---

### 4. watch와 watchEffect: 사이드 이펙트 관리

- **watchEffect**: 함수를 즉시 실행하고 사용된 모든 데이터를 자동으로 추적합니다.
- **watch**: 특정 소스를 감시하다가 값이 변할 때만 콜백을 실행하며, 이전 값(`oldValue`)과 새 값(`newValue`)을 제공합니다.

```javascript
export function watchEffect(fn) {
    const wrappedEffect = () => {
        const prevEffect = activeEffect;
        activeEffect = wrappedEffect;
        try { return fn(); } 
        finally { activeEffect = prevEffect; }
    };
    wrappedEffect();
}

export function watch(source, callback) {
    let oldValue;
    let isFirstRun = true;
    const getter = typeof source === 'function' ? source : () => source.value;

    const job = () => {
        const newValue = getter();
        if (!isFirstRun) callback(newValue, oldValue);
        oldValue = newValue;
        isFirstRun = false;
    };

    const wrappedEffect = () => job();
    activeEffect = wrappedEffect;
    job(); // 초기값 수집
    activeEffect = null;
}
```

---

### 5. 테스트: 실제로 잘 동작할까?

구현한 Mini-Vue가 복합적인 의존성 관계에서도 잘 동작하는지 확인해 봅시다.

```javascript
const count = ref(0);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

watch(count, (newVal) => console.log('[watch - count]', newVal));
watchEffect(() => console.log('[watchEffect - quadruple]', quadruple.value));

// 트리거
count.value++; 
// 출력:
// [watchEffect - quadruple] 0 (최초 실행)
// [watch - count] 1
// [watchEffect - quadruple] 4
```

### 마치며

Mini-Vue 구현을 통해 Vue 3 반응형 시스템의 핵심이 **Proxy**와 **의존성 그래프 관리**에 있다는 것을 배웠습니다. 이러한 원리를 이해하면 Vue 앱의 성능 최적화나 복잡한 상태 관리 로직을 더 명확하게 설계할 수 있습니다.
