package com.exam.decorator.javaio;

import java.io.*;

public class InputTest {
    public static void main(String[] args) throws IOException {
        String str;
        try {
            // 파일을 읽어 대문자를 소문자로 바꾸는 InputStream
            InputStream in = new LowerCaseInputStream(
                    new BufferedInputStream(
                            new FileInputStream("src/main/java/com/exam/decorator/javaio/test.txt")
                    )
            );
            // UTF-8로 읽기 위해 Reader로 감싼다.
            BufferedReader br = new BufferedReader(
                    new InputStreamReader(in, "utf8"), 8192
            );

            while ((str = br.readLine()) != null) {
                System.out.print(str);
            }
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
