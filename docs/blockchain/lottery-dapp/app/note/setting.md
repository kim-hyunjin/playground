# CRA + Typescript + Web3 프로젝트 설정

## 설정 중 발생한 문제와 해결방법

### 문제 1. webpack5부터 Node.js 모듈에 대한 polyfill들을 제공하지 않는다.

Web3 라이브러리가 이 polyfill들을 필요로 한다.  
현재로선 webpack.config.js에 필요한 polyfill들을 직접 추가해야줘야 한다는데...

#### 해결방법

webpack.config.js plugins에 NodePolyfillPlugin을 추가해주면 된다!

webpack.config.js를 커스텀하려면 npm eject를 사용해하는데, 한번 eject하면 이후부턴 모든 설정들을 직접 유지보수해야 하고, 돌이킬 수 없기 때문에 아래의 방법을 사용했다.

#### customize-cra & react-app-rewired

https://github.com/arackaf/customize-cra

1. install

    ```
    npm i -D customize-cra react-app-rewired
    ```

2. config-overrides.js 작성

    ```
    const { override, addWebpackPlugin } = require("customize-cra");
    const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

    module.exports = override(addWebpackPlugin(new NodePolyfillPlugin()));

    ```

3. package.json의 scripts 명령어 수정

```
"scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    },
```

### 문제 2. source map 파싱 실패

```
Failed to parse source map from ...  Error: ENOENT: no such file or directory ...
```

source map 생성 중 파일이 존재하지 않아 실패..

#### 해결방법

위에서와 같이 customize-cra를 사용해 webpack 설정에서 source-map-loader에 존재하지 않는 파일의 경로를 제외하는 방식으로 처리하려고 했으나 실패  
일단 source map을 생성하지 않게 설정하는 것으로 마무리 했다.

```
.env file
GENERATE_SOURCEMAP=false
```
