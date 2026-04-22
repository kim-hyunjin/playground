// Apache HttpComponents 사용법 : HttpClient5 - GET 요청하기 III
package com.eomcs.httpcomponents.client;

import java.util.ArrayList;
import java.util.List;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.UrlEncodedFormEntity;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.NameValuePair;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.message.BasicNameValuePair;

public class Exam0130 {

  public static void main(String[] args) throws Exception {
    // try-with-resources 적용
    try (CloseableHttpClient httpclient = HttpClients.createDefault()) {
      HttpGet httpGet = new HttpGet("http://httpbin.org/get");
      try (CloseableHttpResponse response1 = httpclient.execute(httpGet)) {
        System.out.println(response1.getCode() + " " + response1.getReasonPhrase());
        HttpEntity entity1 = response1.getEntity();
        // do something useful with the response body
        // and ensure it is fully consumed
        System.out.println(EntityUtils.toString(entity1));
        EntityUtils.consume(entity1);
      }

      HttpPost httpPost = new HttpPost("http://httpbin.org/post");
      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("username", "vip"));
      nvps.add(new BasicNameValuePair("password", "secret"));
      httpPost.setEntity(new UrlEncodedFormEntity(nvps));

      try (CloseableHttpResponse response2 = httpclient.execute(httpPost)) {
        System.out.println(response2.getCode() + " " + response2.getReasonPhrase());
        HttpEntity entity2 = response2.getEntity();
        // do something useful with the response body
        // and ensure it is fully consumed
        EntityUtils.consume(entity2);
      }
    }
  }
}
