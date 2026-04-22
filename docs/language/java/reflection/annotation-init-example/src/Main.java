/*
 *  MIT License
 *
 *  Copyright (c) 2020 Michael Pogrebinsky - Java Reflection - Master Class
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import annotations.InitializerClass;
import annotations.InitializerMethod;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Annotations - Application Initialization
 * https://www.udemy.com/course/java-reflection-master-class
 */
public class Main {

    /**
     * 프로그램 시작점
     * 지정된 패키지들에서 @InitializerClass 어노테이션이 붙은 클래스들을 찾아 초기화
     */
    public static void main(String[] args) throws Throwable {
        // 앱의 핵심 패키지들을 초기화 대상으로 지정
        initialize("app", "app.configs", "app.databases", "app.http");
    }

    /**
     * 어노테이션 기반 자동 초기화 시스템의 핵심 메서드
     * 지정된 패키지들에서 @InitializerClass 어노테이션이 붙은 클래스들을 찾아 초기화 메서드들을 실행
     */
    public static void initialize(String... packageNames) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, ClassNotFoundException, IOException, URISyntaxException {
        // 지정된 패키지들에서 모든 클래스들을 수집
        List<Class<?>> classes = getAllClasses(packageNames);

        // 각 클래스를 검사하여 초기화 작업 수행
        for (Class<?> clazz : classes) {
            // @InitializerClass 어노테이션이 없는 클래스는 건너뛰기
            if (!clazz.isAnnotationPresent(InitializerClass.class)) {
                continue;
            }

            // 클래스 내에서 @InitializerMethod 어노테이션이 붙은 메서드들 찾기
            List<Method> methods = getAllInitializingMethods(clazz);

            // 기본 생성자를 사용하여 클래스의 인스턴스 생성
            Object instance = clazz.getDeclaredConstructor().newInstance();

            // 모든 초기화 메서드들을 순차적으로 실행
            for (Method method : methods) {
                method.invoke(instance);
            }
        }
    }

    /**
     * 주어진 클래스에서 @InitializerMethod 어노테이션이 붙은 모든 메서드들을 찾아 반환
     */
    private static List<Method> getAllInitializingMethods(Class<?> clazz) {
        List<Method> initializingMethods = new ArrayList<>();
        // 클래스의 모든 선언된 메서드들을 검사
        for (Method method : clazz.getDeclaredMethods()) {
            // @InitializerMethod 어노테이션이 붙은 메서드만 수집
            if (method.isAnnotationPresent(InitializerMethod.class)) {
                initializingMethods.add(method);
            }
        }
        return initializingMethods;
    }

    /**
     * 지정된 패키지들에서 모든 클래스들을 동적으로 로딩하여 반환
     * JAR 파일과 일반 파일 시스템 모두 지원
     */
    public static List<Class<?>> getAllClasses(String... packageNames) throws URISyntaxException, IOException, ClassNotFoundException {
        List<Class<?>> allClasses = new ArrayList<>();

        // 각 패키지를 순회하며 클래스들을 수집
        for (String packageName : packageNames) {
            // 패키지명을 파일 경로로 변환 (예: com.example -> com/example)
            String packageRelativePath = packageName.replace('.', '/');

            // 패키지 리소스의 URI를 가져옴
            URI packageUri = Main.class.getResource(packageRelativePath).toURI();

            // 파일 시스템 타입에 따라 다른 처리 방식 적용
            if (packageUri.getScheme().equals("file")) {
                // 개발 환경: 일반 파일 시스템에서 클래스 파일들 직접 접근
                Path packageFullPath = Paths.get(packageUri);
                allClasses.addAll(getAllPackageClasses(packageFullPath, packageName));
            } else if (packageUri.getScheme().equals("jar")) {
                // 배포 환경: JAR 파일 내부의 클래스 파일들에 접근
                /**
                 * JAR 파일의 특성
                 *
                 *   JAR 파일은 압축된 아카이브입니다. 일반 폴더처럼 직접 접근할 수 없고, 가상 파일 시스템으로 취급해야 합니다.
                 *
                 *   일반 파일 vs JAR 파일 접근 방식
                 *
                 *   개발 환경 (일반 파일)
                 *
                 *   프로젝트/
                 *   ├── src/
                 *   │   └── app/
                 *   │       ├── AutoSaver.class
                 *   │       └── ConfigsLoader.class
                 *   - 물리적 폴더로 존재
                 *   - Paths.get(uri) 로 직접 접근 가능
                 *
                 *   배포 환경 (JAR 파일)
                 *
                 *   myapp.jar (압축 파일)
                 *   ├── app/
                 *   │   ├── AutoSaver.class
                 *   │   └── ConfigsLoader.class
                 *   - ZIP 형태로 압축되어 있음
                 *   - 내부 파일들을 읽으려면 압축을 해제하거나 특별한 방법 필요
                 *
                 *   FileSystem이 필요한 이유
                 *
                 *   1. JAR는 가상 파일 시스템
                 *
                 *   // JAR 내부는 이런 URI를 가집니다
                 *   jar:file:/path/to/myapp.jar!/app/configs
                 *
                 *   2. 일반 파일 시스템 API로는 접근 불가
                 *
                 *   // 이건 작동하지 않습니다!
                 *   Path jarPath = Paths.get("jar:file:/myapp.jar!/app");  // 에러!
                 *
                 *   3. JAR 전용 FileSystem 생성 필요
                 *
                 *   // JAR 파일을 마치 폴더처럼 다룰 수 있는 가상 파일 시스템 생성
                 *   FileSystem jarFileSystem = FileSystems.newFileSystem(packageUri, Collections.emptyMap());
                 *
                 *   // 이제 JAR 내부를 일반 폴더처럼 탐색 가능
                 *   Path pathInsideJar = jarFileSystem.getPath("app/configs");
                 *   Files.list(pathInsideJar);  // JAR 내부 파일들 나열
                 *
                 *   실제 비유
                 *
                 *   JAR 파일을 ZIP 파일로 생각해보세요:
                 *
                 *   1. ZIP 파일 내부의 파일을 보려면 → ZIP을 "마운트"해야 함
                 *   2. JAR 파일 내부의 클래스를 읽으려면 → JAR을 "FileSystem으로 마운트"해야 함
                 *
                 *   // ZIP/JAR을 가상 드라이브처럼 마운트
                 *   FileSystem jarFS = FileSystems.newFileSystem(jarUri, Collections.emptyMap());
                 *
                 *   // 마운트된 가상 드라이브에서 파일 탐색
                 *   Path virtualPath = jarFS.getPath("app/");
                 *   Files.list(virtualPath);  // JAR 내부 파일들 나열
                 *
                 *   // 사용 후 언마운트
                 *   jarFS.close();
                 *
                 *   이렇게 해야 JAR 내부의 클래스 파일들을 일반 파일처럼 다룰 수 있습니다.
                 */
                FileSystem fileSystem = FileSystems.newFileSystem(packageUri, Collections.emptyMap());

                Path packageFullPathInJar = fileSystem.getPath(packageRelativePath);
                allClasses.addAll(getAllPackageClasses(packageFullPathInJar, packageName));

                // JAR 파일 시스템 리소스 해제
                fileSystem.close();
            }
        }
        return allClasses;
    }

    /**
     * 특정 패키지 경로에서 모든 .class 파일들을 찾아 Class 객체로 변환하여 반환
     */
    private static List<Class<?>> getAllPackageClasses(Path packagePath, String packageName) throws IOException, ClassNotFoundException {

        // 패키지 경로가 존재하지 않으면 빈 리스트 반환
        if (!Files.exists(packagePath)) {
            return Collections.emptyList();
        }

        // 패키지 내의 모든 일반 파일들을 수집
        List<Path> files = Files.list(packagePath)
                .filter(Files::isRegularFile)
                .collect(Collectors.toList());

        List<Class<?>> classes = new ArrayList<>();

        // 각 파일을 검사하여 .class 파일만 처리
        for (Path filePath : files) {
            String fileName = filePath.getFileName().toString();

            // .class 확장자를 가진 파일만 처리
            if (fileName.endsWith(".class")) {
                // 파일명에서 .class 확장자를 제거하고 완전한 클래스명 생성
                String classFullName = packageName.isBlank() ?
                        fileName.replaceFirst("\\.class$", "")  // 패키지명이 없는 경우
                        : packageName + "." + fileName.replaceFirst("\\.class$", "");  // 패키지명.클래스명

                // 클래스명으로부터 실제 Class 객체를 로딩
                Class<?> clazz = Class.forName(classFullName);
                classes.add(clazz);
            }
        }
        return classes;
    }
}
