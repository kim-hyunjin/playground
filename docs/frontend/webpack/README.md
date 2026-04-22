# 웹팩?

웹팩은 여러개 파일을 하나의 파일로 합쳐주는 번들러(bundler)다. 하나의 시작점(entry point)으로부터 의존적인 모듈을 전부 찾아내서 하나의 결과물을 만들어 낸다.

```
$ npm install -D webpack webpack-cli
$ node_modules/.bin/webpack --help
```

```
$ node_modules/.bin/webpack --entry ./src/app.js
```

    --mode 옵션으로 development, production 중 원하는 모드를 적용할 수 있다.(옵션을 주지 않으면 production으로 동작 - production 모드는 Webpack 모듈 번들링 과정에서 자체적으로 코드를 최적화하여 용량을 줄입니다.)
    -o 옵션으로 결과물이 생성될 경로를 지정해 줄 수 있다.

# 로더

웹팩은 모든 파일을 모듈로 바라본다. 자바스크립트로 만든 모듈 뿐만아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에 import 구문을 사용하면 자바스크립트 코드 안으로 가져올수 있다.

로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로 변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다. 뿐만아니라 CSS 파일을 자바스크립트에서 직접 로딩할수 있도록 해준다.

## 자주 사용하는 로더

### css-loader

CSS 파일을 자바스크립트에서 불러와 사용하려면 CSS를 모듈로 변환하는 작업이 필요하다.  
css-loader는 CSS 파일을 모듈처럼 불러와 사용할 수 있게 해준다.

```
$ npm install -D css-loader
```

### style-loader

모듈로 변경된 스타일 시트는 돔에 추가되어야만 브라우져가 해석할 수 있다. css-loader로 처리하면 자바스크립트 코드로만 변경된다.

style-loader는 자바스크립트로 변경된 스타일을 동적으로 돔에 추가하는 로더이다. 따라서 CSS를 번들링하기 위해서는 css-loader와 style-loader를 함께 사용한다.

```
$ npm install -D style-loader
```

스타일 시트에서 이미지 파일을 사용하면 해당 이미지 파일명을 해싱하여 dist 폴더로 복사한다.

```
body {
  background-image: url("../image/bg.jpg");
}
```

```
# 결과물
dist/
    b12d7f95bec449956d09.jpg
    main.js
```

# 플러그인

## mini-css-extract-plugin

For production builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on. This can be achieved by using the mini-css-extract-plugin, because it creates separate css files. For development mode (including webpack-dev-server) you can use style-loader, because it injects CSS into the DOM using multiple <style></style> and works faster.

#### webpack.config.js

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};
```

현재 index.html에 직접 link로 css 파일을 달아주어야 적용된다...


[참고자료]
- https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html#2-%EC%97%94%ED%8A%B8%EB%A6%AC%EC%95%84%EC%9B%83%ED%92%8B

- https://github.com/webpack-contrib/mini-css-extract-plugin

- https://github.com/webpack/webpack

- https://www.zerocho.com/category/Webpack/post/58aa916d745ca90018e5301d
