const path = require("path");
const webpack = require("webpack");
const MyPlugin = require("./myplugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    // mode: "production",
    entry: {
        main: "./src/app.js", // key로 사용된 main이 결과물의 이름 => 임의로 바꿔도 된다.
    },
    output: {
        filename: "[name].js",
        path: path.resolve("./dist"),
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/, // .js 확장자로 끝나는 모든 파일
            //     use: [path.resolve("./myloader.js")], // 내 로더 적용
            // },
            {
                test: /\.css$/i,
                // 로더 경로를 설정하는 대신 배열에 로더 이름을 문자열로 전달해도 된다.
                use: [
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    "css-loader",
                ], // 배열의 뒤에서부터 앞으로 로더가 동작한다.
            },
            {
                test: /.(png|jpe?g|gif|svg|webp)$/i,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[contenthash].[ext]",
                        publicPath: "dist/",
                    },
                },
            },
        ],
    },
    plugins: [
        // dist폴더 안을 모두 삭제한 후 결과물을 만든다.(결과물에 포함되면 안되거나 불필요한 파일들을 삭제)
        new CleanWebpackPlugin(),
        new MyPlugin(),
        // 결과물에 추가 정보를 추가할 수 있게 도와주는 플러그인
        new webpack.BannerPlugin({
            banner: () => `
            === MY BANNER ===
            빌드 날짜: ${new Date().toLocaleDateString()}
            `,
        }),
        // 환경 정보(전역변수)를 추가할 수 있게 도와주는 플러그인
        new webpack.DefinePlugin({
            VERSION: JSON.stringify("v0.0.1"),
            PRODUCTION: JSON.stringify(false),
        }),
        // 스타일시트가 점점 많아지면 하나의 자바스크립트 결과물로 만드는 것이 부담일 수 있다.
        // 아래 플러그인으로 css파일을 포함하는 js파일마다 별도의 CSS 파일로 만들어두어 브라우저의 리소스 다운로드 시간을 줄일 수 있다.
        new MiniCssExtractPlugin(),
        // HTML 파일을 후처리할 수 있게 도와주는 플러그인
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true, // 빈칸 제거
                removeComments: true, // 주석 제거
            },
            hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
        }),
    ],
};
