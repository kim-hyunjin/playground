// mini-vue의 핵심 기능들을 가져옴
import {ref, reactive, computed, watch, watchEffect} from "./mini-vue.js";

// ==================== ref 테스트 ====================
// ref는 단일 값을 반응형으로 만들어주는 함수입니다.
console.log('TEST - ref =========================')


const count = ref(0);
const double = computed(() => count.value * 2)
const quadruple = computed(() => double.value * 2)


watch(count, () => {
  console.log('[watch - count]', count.value)
})
watch(double, () => {
  console.log('[watch - double]', double.value)
})
watch(quadruple, () => {
  console.log('[watch - quadruple]', quadruple.value)
})

watchEffect(() => {
  console.log('[watchEffect - count]', count.value)
})
watchEffect(() => {
  console.log('[watchEffect - double]', double.value)
})
watchEffect(() => {
  console.log('[watchEffect - quadruple]', quadruple.value)
})

// 트리거
count.value++
count.value++


console.log('\n------------------------------------\n')

// ==================== reactive 테스트 ====================
// reactive는 객체 전체를 반응형으로 만들어주는 함수입니다.
console.log('TEST - reactive ====================')

const student = reactive({
  score: 70
})
const grade = computed(() => {
  if (student.score >= 90) return 'A';
  if (student.score >= 80) return 'B';
  if (student.score >= 70) return 'C';
  if (student.score >= 60) return 'D';
  return 'F';
})

watch(student, () => {
  console.log('[watch - student]', student.score)
})
watch(grade, () => {
  console.log('[watch - grade]', grade.value)
})

watchEffect(() => {
  console.log('[watchEffect - student]', student.score)
})
watchEffect(() => {
  console.log('[watchEffect - grade]', grade.value)
})

// 트리거
student.score = 90
student.score = 80

// 테스트 실행 결과를 확인하면:
// 1. watchEffect는 설정 즉시 한 번 실행됩니다.
// 2. 값이 변경될 때마다 관련된 모든 반응형 효과가 실행됩니다.
// 3. watch는 최초 설정 시에는 실행되지 않고, 값이 변경될 때만 실행됩니다.
// 4. computed 값은 의존하는 값이 변경될 때만 재계산됩니다.