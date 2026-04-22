/**
 *  핵심 의존성 관리 (track / trigger)
 */
// 현재 실행 중인 반응형 효과를 추적하는 전역 변수
// 이 변수는 현재 추적 중인 효과(함수)를 저장합니다
let activeEffect = null;

// 모든 반응형 객체와 그 속성에 대한 의존성을 저장하는 자료구조
// WeakMap을 사용하여 객체가 가비지 컬렉션될 때 메모리 누수를 방지합니다
const targetMap = new WeakMap();

/**
 * 반응형 객체의 속성 접근을 추적하는 함수
 * 
 * @param {Object} target - 추적할 대상 객체
 * @param {string|symbol} key - 추적할 속성 키
 * 
 * 현재 활성화된 효과(activeEffect)를 대상 객체의 특정 속성에 연결하여
 * 나중에 해당 속성이 변경될 때 효과를 다시 실행할 수 있도록 의존성을 등록합니다.
 */
function track(target, key) {
    // 현재 활성화된 효과가 없으면 추적할 필요가 없으므로 함수 종료
    if (!activeEffect) return;

    // 대상 객체에 대한 의존성 맵을 가져옴
    // 의존성 맵은 객체의 각 속성(키)과 그에 의존하는 효과들의 관계를 저장
    let depsMap = targetMap.get(target);
    
    // 이 객체에 대한 의존성 맵이 아직 없으면 새로 생성
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    // 특정 속성(키)에 대한 의존성 집합을 가져옴
    // 이 집합은 해당 속성이 변경될 때 실행해야 할 모든 효과를 포함
    let dep = depsMap.get(key);
    
    // 이 속성에 대한 의존성 집합이 아직 없으면 새로 생성
    if (!dep) {
        dep = new Set();  // Set을 사용하여 중복 효과 등록 방지
        depsMap.set(key, dep);
    }

    // 현재 활성화된 효과를 의존성 집합에 추가
    // 이렇게 하면 나중에 이 속성이 변경될 때 이 효과가 실행됨
    dep.add(activeEffect);
}

/**
 * 반응형 객체의 속성 변경 시 관련 효과를 실행하는 함수
 * 
 * @param {Object} target - 변경된 대상 객체
 * @param {string|symbol} key - 변경된 속성 키
 * 
 * 특정 객체의 속성이 변경되었을 때 해당 속성에 의존하는 모든 효과를 실행합니다.
 * 무한 루프를 방지하기 위해 현재 실행 중인 효과는 건너뜁니다.
 */
function trigger(target, key) {
    // 대상 객체에 대한 의존성 맵을 가져옴
    const depsMap = targetMap.get(target);
    
    // 이 객체에 대한 의존성 맵이 없으면 함수 종료 (아무 효과도 등록되지 않음)
    if (!depsMap) return;

    // 특정 속성(키)에 대한 의존성 집합을 가져옴
    const dep = depsMap.get(key);
    
    // 이 속성에 대한 의존성 집합이 없으면 함수 종료 (아무 효과도 등록되지 않음)
    if (!dep) return;
    
    // 의존성 집합에 있는 모든 효과를 실행
    dep.forEach(effect => {
        // 현재 실행 중인 효과는 건너뜀 (무한 루프 방지)
        // 예: 효과 내에서 같은 속성을 변경하는 경우
        if (effect !== activeEffect) {
            // 효과 함수 실행
            effect();
        }
    });
}

/**
 * 반응형 참조 값을 생성하는 함수
 * 
 * @param {any} initialValue - 초기값
 * @returns {Object} - value 속성을 가진 반응형 객체
 * 
 * 단일 값을 반응형으로 만들어 값이 변경될 때 의존하는 효과들이 자동으로 실행되도록 합니다.
 * .value 속성을 통해 값에 접근하고 수정할 수 있습니다.
 */
export function ref(initialValue) {
    // 내부 변수에 초기값 저장 (클로저를 통해 값을 보호)
    let _value = initialValue;

    // 반응형 객체 생성
    const r = {
        // value 속성에 접근할 때 실행되는 getter
        get value() {
            // 이 속성에 접근했다는 것을 추적 시스템에 등록
            // 이렇게 하면 이 ref가 사용된 효과들이 나중에 값이 변경될 때 다시 실행됨
            track(r, 'value');
            
            // 저장된 값 반환
            return _value;
        },
        
        // value 속성에 값을 할당할 때 실행되는 setter
        set value(newVal) {
            // 값이 실제로 변경된 경우에만 처리 (불필요한 재렌더링 방지)
            if (newVal !== _value) {
                // 새 값을 내부 변수에 저장
                _value = newVal;
                
                // 이 ref의 값이 변경되었음을 알리고 의존하는 모든 효과를 실행
                trigger(r, 'value');
            }
        }
    };

    // 반응형 객체 반환
    return r;
}

/**
 * 객체를 반응형으로 변환하는 함수
 * 
 * @param {Object} target - 반응형으로 만들 대상 객체
 * @returns {Proxy} - 원본 객체의 반응형 프록시
 * 
 * 객체의 모든 속성에 대한 접근과 수정을 가로채서 의존성 추적 및 변경 감지를 수행합니다.
 * 객체의 속성이 변경될 때 해당 속성에 의존하는 효과들이 자동으로 실행됩니다.
 */
export function reactive(target) {
    // Proxy 객체를 생성하여 원본 객체의 속성 접근과 수정을 가로챔
    // Proxy는 JavaScript의 내장 기능으로, 객체의 기본 동작을 사용자 정의 동작으로 재정의할 수 있게 해줌
    return new Proxy(target, {
        // 객체의 속성에 접근할 때 호출되는 핸들러 (obj[key] 또는 obj.key 형태로 접근할 때)
        get(obj, key) {
            // 이 속성에 접근했다는 것을 추적 시스템에 등록
            track(obj, key);
            
            // 원본 객체의 속성 값 반환
            return obj[key];
        },
        
        // 객체의 속성에 값을 할당할 때 호출되는 핸들러 (obj[key] = value 또는 obj.key = value 형태로 할당할 때)
        set(obj, key, value) {
            // 원본 객체의 속성 값 변경
            obj[key] = value;
            
            // 이 속성이 변경되었음을 알리고 의존하는 모든 효과를 실행
            trigger(obj, key);
            
            // 성공적으로 설정되었음을 나타내는 true 반환 (Proxy 명세에 따라 필요)
            return true;
        }
    });
}

/**
 * 계산된 속성을 생성하는 함수
 * 
 * @param {Function} getter - 계산된 값을 반환하는 함수
 * @returns {Object} - value 속성을 가진 읽기 전용 반응형 객체
 * 
 * 다른 반응형 상태에 기반하여 자동으로 계산되는 값을 생성합니다.
 * 의존하는 반응형 상태가 변경될 때만 재계산되며, 결과는 캐시됩니다.
 * 동일한 값이 여러 번 접근되어도 의존성이 변경되지 않는 한 getter 함수는 한 번만 실행됩니다.
 */
export function computed(getter) {
    // 계산된 값을 저장할 변수
    let value;
    
    // 계산된 값이 최신 상태인지 여부를 나타내는 플래그
    // true면 getter를 다시 실행해야 함을 의미, false면 캐시된 값을 사용할 수 있음을 의미
    let dirty = true;

    // 계산된 속성 객체 생성
    const computedRef = {
        // value 속성에 접근할 때 실행되는 getter
        get value() {
            // 이 계산된 속성에 접근했다는 것을 추적 시스템에 등록
            // 이렇게 하면 이 계산된 속성이 다른 계산된 속성이나 효과에서 사용될 때
            // 의존성 관계가 올바르게 설정됨
            track(computedRef, 'value');

            // 값이 더러운 상태(최신 상태가 아님)인 경우에만 getter 함수를 실행하여 값 재계산
            if (dirty) {
                // 값을 계산했으므로 더 이상 더럽지 않음으로 표시
                dirty = false;
                
                // 현재 활성 효과를 effectFn으로 설정하여 getter 내부의 반응형 속성들이
                // 이 계산된 속성의 효과 함수에 의존하도록 함
                activeEffect = effectFn;
                
                // getter 함수 실행하여 값 계산
                // 이 과정에서 getter 내부에서 사용된 모든 반응형 속성들이 추적됨
                value = getter();
                
                // 활성 효과 초기화
                activeEffect = null;
            }

            // 계산된 값 반환 (캐시된 값 또는 새로 계산된 값)
            return value;
        }
    };

    // 이 계산된 속성의 의존성이 변경될 때 실행될 효과 함수
    const effectFn = () => {
        // 의존성이 변경되었으므로 다음에 값에 접근할 때 재계산하도록 더러운 상태로 표시
        dirty = true;
        
        // 이 계산된 속성의 값이 변경되었음을 알리고 이 계산된 속성에 의존하는 다른 효과들을 실행
        trigger(computedRef, 'value');
    };

    // 초기 의존성 추적 설정
    // 이 부분은 계산된 속성이 생성될 때 한 번만 실행되어 초기 의존성을 설정함
    activeEffect = effectFn;
    
    // getter 함수를 실행하여 의존성 추적
    // 이 시점에서는 값을 사용하지 않고 단지 의존성을 설정하기 위한 목적
    getter();
    
    // 활성 효과 초기화
    activeEffect = null;

    // 계산된 속성 객체 반환
    return computedRef;
}

/**
 * 반응형 효과를 생성하고 즉시 실행하는 함수
 * 
 * @param {Function} fn - 실행할 효과 함수
 * 
 * 전달된 함수를 즉시 실행하고, 함수 내에서 접근한 모든 반응형 상태를 자동으로 추적합니다.
 * 추적된 반응형 상태가 변경될 때마다 함수가 자동으로 다시 실행됩니다.
 * 의존성을 명시적으로 선언할 필요 없이 사용된 반응형 상태를 자동으로 감지합니다.
 */
export function watchEffect(fn) {
    // 효과 함수를 래핑하여 의존성 추적을 관리하는 함수 생성
    // 이 래핑된 함수는 효과 실행 전후에 activeEffect를 적절히 설정하고 복원함
    const wrappedEffect = () => {
        // 현재 활성 효과를 저장 (중첩된 효과 호출을 지원하기 위함)
        // 이렇게 하면 효과 내부에서 다른 효과를 호출해도 의존성 추적이 올바르게 작동함
        const prevEffect = activeEffect;
        
        // 이 효과를 현재 활성 효과로 설정
        // 이제 이 효과 실행 중에 접근하는 모든 반응형 속성들이 이 효과에 의존하게 됨
        activeEffect = wrappedEffect;
        
        try {
            // 사용자가 제공한 효과 함수 실행
            // 이 과정에서 함수 내부에서 사용된 모든 반응형 속성들이 자동으로 추적됨
            return fn();
        } finally {
            // 이전 활성 효과 복원 (try-finally 블록을 사용하여 에러가 발생해도 항상 실행됨)
            // 이는 효과 스택의 무결성을 유지하기 위해 중요함
            activeEffect = prevEffect;
        }
    };
    
    // 효과 함수 최초 실행
    // 이 실행을 통해 초기 의존성이 설정되고, 이후 의존하는 반응형 속성이 변경될 때마다
    // 이 효과가 자동으로 다시 실행됨
    wrappedEffect();
}

/**
 * 반응형 상태를 감시하고 변경 시 콜백을 실행하는 함수
 * 
 * @param {Function|Object} source - 감시할 반응형 상태 (함수, ref, computed, reactive 객체)
 * @param {Function} callback - 상태 변경 시 호출될 콜백 함수 (newValue, oldValue)
 * 
 * 특정 반응형 상태의 변화를 감시하고, 변경될 때마다 콜백 함수를 호출합니다.
 * 콜백은 새 값과 이전 값을 인자로 받으며, 최초 실행 시에는 콜백이 호출되지 않습니다.
 * 다양한 유형의 반응형 소스(함수, ref, computed, reactive 객체)를 지원합니다.
 */
export function watch(source, callback) {
    // 이전 값을 저장하기 위한 변수 (콜백에 전달할 oldValue)
    let oldValue;
    
    // 최초 실행 여부를 추적하는 플래그
    // watch는 최초 실행 시에는 콜백을 호출하지 않고, 변경이 발생할 때만 콜백을 호출함
    let isFirstRun = true;

    // 다양한 소스 타입에 대한 getter 함수 생성
    // watch는 함수, ref, computed, reactive 객체 등 다양한 타입의 소스를 지원함
    const getter = 
        // 1. 함수인 경우: 그대로 사용 (사용자가 제공한 getter 함수)
        typeof source === 'function'
            ? source
            // 2. ref나 computed인 경우: .value 속성에 접근하는 함수 생성
            : source && typeof source === 'object' && 'value' in source
                ? () => source.value 
                // 3. reactive 객체인 경우: 객체의 모든 속성을 재귀적으로 순회하는 함수 사용
                : () => traverse(source);

    // 값이 변경될 때마다 실행될 작업 정의
    const job = () => {
        // 현재 값 가져오기
        const newValue = getter();
        
        // 최초 실행이 아닌 경우에만 콜백 호출
        // 이렇게 하면 watch 생성 시점에는 콜백이 실행되지 않고, 
        // 이후 값이 변경될 때만 콜백이 실행됨
        if (!isFirstRun) {
            // 콜백에 새 값과 이전 값 전달
            callback(newValue, oldValue);
        }
        
        // 다음 실행을 위해 현재 값을 이전 값으로 저장
        oldValue = newValue;
        
        // 최초 실행 플래그 해제
        isFirstRun = false;
    };

    // 의존성이 변경될 때 실행될 효과 함수 생성
    // 단순히 job 함수를 호출하는 래퍼 함수
    const wrappedEffect = () => job();

    // 효과 설정 및 의존성 추적
    // 현재 활성 효과 저장
    const prevEffect = activeEffect;
    
    // 이 효과를 현재 활성 효과로 설정
    activeEffect = wrappedEffect;
    
    // 최초 실행하여 초기 값 저장 및 의존성 추적
    // 이 시점에서는 콜백이 호출되지 않지만, 의존성은 설정됨
    job();
    
    // 이전 활성 효과 복원
    activeEffect = prevEffect;
}

/**
 * 객체의 모든 중첩 속성을 재귀적으로 순회하는 함수
 * 
 * @param {Object} value - 순회할 객체
 * @param {Set} seen - 이미 방문한 객체를 추적하는 Set (순환 참조 방지용)
 * @returns {Object} - 순회한 원본 객체
 * 
 * 객체의 모든 중첩 속성에 접근하여 반응형 시스템이 전체 객체 구조를 추적할 수 있도록 합니다.
 * 순환 참조를 방지하기 위해 이미 방문한 객체는 다시 순회하지 않습니다.
 * watch 함수에서 reactive 객체를 깊게 감시할 때 사용됩니다.
 */
function traverse(value, seen = new Set()) {
    // 기본 검사: 객체가 아니거나, null이거나, 이미 방문한 객체인 경우 처리 중단
    // - 객체가 아닌 경우: 더 이상 순회할 속성이 없음
    // - null인 경우: 속성에 접근하면 오류 발생
    // - 이미 방문한 경우: 순환 참조를 방지하기 위해 중복 방문 방지
    if (typeof value !== 'object' || value === null || seen.has(value)) return;
    
    // 현재 객체를 방문한 객체 집합에 추가 (순환 참조 감지용)
    seen.add(value);

    // 객체의 모든 속성을 순회
    for (const key in value) {
        // 각 속성에 대해 재귀적으로 traverse 함수 호출
        // 이렇게 하면 중첩된 객체의 모든 속성에 접근하여 반응형 시스템이 추적할 수 있게 됨
        traverse(value[key], seen);
    }
    
    // 순회가 완료된 원본 객체 반환
    // 이 반환값은 watch 함수에서 사용됨
    return value;
}