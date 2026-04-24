package com.exam.templatemethod;

import javax.swing.*;
import java.awt.*;

public class MyFrame extends JFrame {

    public MyFrame(String title) {
        super(title);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        this.setSize(300, 300);
        this.setVisible(true);
    }

    /**
     * JFrame의 update() 알고리즘에서는 paint()를 호출합니다. 기본적으로 paint()에서는 아무일도 하지 않습니다.(후크 메소드)
     * 여기에서는 paint()를 오버라이드해서 윈도우에 메시지를 그립니다.
     * @param graphics
     */
    @Override
    public void paint(Graphics graphics) {
        super.paint(graphics);
        String msg = "내가 최고!";
        graphics.drawString(msg, 100, 100);
    }

    public static void main(String[] args) {
        MyFrame myFrame = new MyFrame("헤드 퍼스트 디자인 패턴");
    }
}
