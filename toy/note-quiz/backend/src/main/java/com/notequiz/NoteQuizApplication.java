package com.notequiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NoteQuizApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoteQuizApplication.class, args);
    }
}
