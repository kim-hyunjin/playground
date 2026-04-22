// 전역 변수
console.log('filename: ', __filename)
console.log('dirname: ', __dirname)


/**
 * console : 콘솔 화면과 관련된 기능을 다루는 객체
 */

// 포맷
console.log('숫자: %d + %d = %d', 1, 2, 1+2);
console.log('문자열: %s', 'hello!');
console.log('JSON : %j', {name: 'hyunjin'});

// 시간 측정
console.time('시간측정');

var output = 1;
for(var i = 1; i <= 10; i++) {
    output *= i;
}
console.log('result: ', output);
console.timeEnd('시간측정');

// ANSI 코드
console.log('\u001b[32m', 'hello world');
console.log('\u001b[33m', 'hello world');
console.log('\u001b[34m', 'hello world');
console.log('\u001b[35m', 'hello world');
console.log('\u001b[0m');

/**
 * process : 프로그램과 관련된 기능을 다루는 객체
 * 웹브라우저에서 작동하는 자바스크립트에는 존재하지 않는다.
 */

// process 객체의 속성
console.log('컴퓨터 환경과 관련된 정보 : ', process.env);
console.log('Node.js 버전 정보 : ', process.version);
console.log('Node.js와 종속된 프로그램 버전 : ', process.versions);
console.log('프로세서의 아키텍처 : ', process.arch);
console.log('플랫폼 정보 : ', process.platform);
console.log('실행 매개 변수 : ', process.argv);

// process 객체의 메소드
console.log('메모리 사용정보 : ', process.memoryUsage())
console.log('프로그램 실행된 시간 : ', process.uptime())

/**
 * exports : 모듈과 관련된 기능을 다루는 객체
 */
var myModule = require('./myModule');
console.log('abs(-273) = %d', myModule.abs(-273));
console.log('circleArea(3) = %d', myModule.circleArea(3));
