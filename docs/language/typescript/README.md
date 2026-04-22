# TypeScript project 구성하기

```
tsc --init
```

## watch mode

```
tsc --watch
```

## debugging

tsconfig.json 파일에서 "sourceMap": true 설정

-   컴파일시 생성되는 .map 파일은 js파일과 ts파일 사이 디버거를 연결하는 bridge 역할을 한다.

# resource

-   tsconfig 문서: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

-   컴파일러 구성 문서: https://www.typescriptlang.org/docs/handbook/compiler-options.html

-   VS Code TS 디버깅: https://code.visualstudio.com/docs/typescript/typescript-debugging
