class MyPlugin {
    // apply 메서드를 구현하면 커스텀 플러그인을 만들 수 있다.
    // apply 메서드는 webpack 컴파일러에 의해 호출되며, 전체 컴파일 라이프사이클에 접근할 수 있다.
    apply(compiler) {
        // 플러그인 작업이 시작될 때 실행
        compiler.hooks.run.tap("MyPlugin", (compilation) => {
            console.log("The webpack build process is starting!");
        });

        // 플러그인 작업이 완료될 때 실행
        compiler.hooks.done.tap("MyPlugin", (compilation) => {
            console.log("The webpack build process is done!");
        });
    }
}

module.exports = MyPlugin;
