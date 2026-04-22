package com.example.userservice.client;

import com.example.userservice.vo.ResponseOrder;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/*
* Eureka Client로 설정 된 애플리케이션은 코드 상에서
* 다른 서비스의 IP address 대신 Eureka Server(Service Registy)에 등록 된
* Application 이름으로 호출 할 수 있다.
*
* 이때는 API Gateway를 거치지 않고, 호출하게 된다.
* 물론 API Gateway를 통해 호출해도 되지만,
* 내부적인 통신을 사용할 때 굳이 외부에서 다시 접속 요청을 할 필요는 없다.
 * */
@FeignClient(name = "order-service")
public interface OrderServiceClient {

    @GetMapping("/order-service/{userId}/orders")
    List<ResponseOrder> getOrders(@PathVariable String userId); // ResponseEntity<List<ResponseOrder>> 로 받을 수도 있다.
}
