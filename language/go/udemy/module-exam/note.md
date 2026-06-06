# https://go.dev/blog/using-go-modules

## Conclusion

-   go mod init creates a new module, initializing the go.mod file that describes it.
-   go build, go test, and other package-building commands add new dependencies to go.mod as needed.
-   go list -m all prints the current module’s dependencies.
-   go get changes the required version of a dependency (or adds a new dependency).
-   go mod tidy removes unused dependencies.

### package doc 읽기

```
$ go doc rsc.io/quote/v3
```

### package에서 사용가능한 버전들 확인하기

```
$ go list -m -versions rsc.io/sampler
```

### 특정 버전의 패키지 가져오기

```
$ go get rsc.io/sampler@v1.3.1
```
