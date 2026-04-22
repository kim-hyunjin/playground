# Dapp 데이터 관리

## READ

-   스마트 컨트랙트 call : 속도가 느리다. 한번 call할 때 필요한 데이터를 한번에 많이 받아오는 것을 고려해봐야함(batch read call)
-   event log를 읽는 방법 : call보다 빠르다.
    -   http polling
    -   websocket

1. init과 동시에 past event들을 가져온다.
2. websocket으로 geth 또는 infura와 연결한다.
3. websocket으로 원하는 이벤트들을 subscribe 한다.

websocket을 사용할 수 없는 환경이라면 long polling을 이용한다.

4. 큰 돈이 오가는 서비스라면 block confirm 확인할 것(confirm이 몇 이상일 때 보여주는 등)
