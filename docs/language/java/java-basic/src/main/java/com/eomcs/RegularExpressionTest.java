package com.eomcs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegularExpressionTest {
  public static void main(String[] args) {
    String protocol;
    String host;
    int port;
    String servletPath;

    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    System.out.printf("명령: ");
    String command = "";
    try {
      command = br.readLine();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    Pattern[] pattern = new Pattern[2];
    pattern[0] = Pattern.compile("^([a-zA-Z]*)://([\\w\\d.]*):([0-9]{0,5})(.*)$");
    pattern[1] = Pattern.compile("^([a-zA-Z]*)://([\\w\\d.]*)(.*)$");
    Matcher matcher = null;
    for (Pattern p : pattern) {
      matcher = p.matcher(command);
      if (matcher.find()) {
        break;
      }
    }
    protocol = matcher.group(1);
    host = matcher.group(2);
    if (matcher.groupCount() == 3) {
      port = 0;
      servletPath = matcher.group(3);
    } else {
      port = Integer.parseInt(matcher.group(3));
      servletPath = matcher.group(4);
    }

    System.out.println("protocol:" + protocol);
    System.out.println("host:" + host);
    System.out.println("port:" + port);
    System.out.println("servletPath:" + servletPath);
  }
}
