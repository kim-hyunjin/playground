---
title: "Truffle과 React로 만드는 로또 Dapp (Lottery) 개발기"
date: 2026-04-24
category: Blockchain
tags: [Ethereum, Solidity, Truffle, React, Web3.js, Dapp]
summary: "이더리움 스마트 컨트랙트 기반의 로또 Dapp을 기획부터 구현, 테스트, 그리고 프론트엔드 연결까지 전 과정을 상세히 알아봅니다."
---

# Truffle과 React로 만드는 로또 Dapp (Lottery)

블록체인 학습에서 가장 흥미로운 주제 중 하나는 바로 '투명한 도박' 혹은 '게임'입니다. 이번 포스트에서는 이더리움 네트워크 위에서 동작하는 로또 Dapp인 **Lottery** 프로젝트의 전체 구조와 핵심 로직을 상세히 파헤쳐 보겠습니다.

---

### 1. 서비스 시나리오 및 규칙

이 로또 서비스는 매우 심플하면서도 블록체인의 특성을 잘 활용합니다.

- **베팅 금액**: 0.005 ETH 고정
- **게임 방식**: 유저는 1바이트(2자리의 16진수, 00~ff)를 선택하여 베팅합니다.
- **당첨 판정**: 유저가 베팅한 시점으로부터 **3번째 뒤의 블록 해시값**의 앞 2자리와 비교합니다.
  - **Win**: 2자리 모두 일치 (팟머니 전체 + 본인 베팅액 획득)
  - **Draw**: 1자리 일치 (본인 베팅액 환불)
  - **Fail**: 일치하는 자리 없음 (베팅액이 팟머니로 귀속)

---

### 2. 스마트 컨트랙트 핵심 로직 (`Lottery.sol`)

가장 중요한 부분은 **"미래의 블록 해시"**를 정답으로 사용한다는 점입니다. 베팅 시점에는 정답을 알 수 없으므로 공정성이 보장됩니다.

#### 베팅 구조체와 상태 관리
```solidity
struct BetInfo {
    uint answerBlockNumber; // 정답이 결정될 블록 번호
    address payable gambler; // 베팅한 유저 주소
    bytes1 challenges;      // 유저가 선택한 값 (1바이트)
}

mapping(uint => BetInfo) private _bets; // 베팅 정보 저장
uint private _pot; // 현재 쌓여있는 팟머니
```

#### 정답 확인 (isMatch)
비트 연산을 통해 1바이트 내의 각 니블(4비트)을 분리하여 비교합니다.
```solidity
function isMatch(bytes1 challenges, bytes32 answer) public pure returns(BettingResult) {
    bytes1 c1 = challenges >> 4; // 첫 번째 글자
    bytes1 c2 = challenges << 4 >> 4; // 두 번째 글자

    bytes1 a1 = answer[0] >> 4;
    bytes1 a2 = answer[0] << 4 >> 4;

    if (c1 == a1 && c2 == a2) return BettingResult.Win;
    if (c1 == a1 || c2 == a2) return BettingResult.Draw;
    return BettingResult.Fail;
}
```

---

### 3. 개발 및 테스트 환경 (Truffle)

스마트 컨트랙트 개발에는 **Truffle** 프레임워크를 사용했습니다.

1. **컴파일 및 배포**: `truffle compile` 후 `truffle migrate`를 통해 로컬 네트워크(Ganache 등)에 배포합니다.
2. **단위 테스트**: 블록체인 특성상 배포 후 수정이 어렵기 때문에 철저한 테스트가 필수입니다.
   - `betAmount`가 정확한지 확인
   - `isMatch` 로직의 경계값 테스트
   - `distribute` 시 팟머니와 유저 잔액의 변화 검증

---

### 4. 프론트엔드 구현 (React + Web3.js)

사용자가 웹에서 베팅하고 결과를 확인할 수 있도록 React 환경을 구축했습니다.

#### Webpack 5 폴리필 이슈
최신 `create-react-app`은 Webpack 5를 사용하는데, `Web3.js`가 필요로 하는 Node.js 핵심 모듈(Buffer, Crypto 등)의 폴리필을 자동으로 포함하지 않습니다. 이를 해결하기 위해 `react-app-rewired`와 `node-polyfill-webpack-plugin`을 설정했습니다.

#### 데이터 읽기 전략: Call vs Event Log
- **Call**: 스마트 컨트랙트의 현재 상태(`getPot` 등)를 읽을 때 사용합니다.
- **Event Log**: 과거의 베팅 내역이나 당첨 결과를 리스트로 보여줄 때 유리합니다. `contract.getPastEvents`를 사용하여 과거 내역을 가져오고, 실시간 업데이트를 위해 주기적으로 폴링(Polling)하거나 WebSocket을 사용합니다.

```javascript
// 과거 이벤트 가져오기 예시
const events = await contract.getPastEvents("BET", {
    fromBlock: 0,
    toBlock: "latest",
});
```

---

### 5. 가스(Gas) 비용 고려사항

이더리움에서 데이터를 저장하는 행위는 비쌉니다.
- **새로운 데이터 저장**: 약 20,000 gas
- **기존 값 변경**: 약 5,000 gas
- **변수 초기화(삭제)**: 가스를 일부 환급(Refund)받음

Lottery 컨트랙트는 베팅 정보를 `mapping`에 저장하고, 결과 확인이 끝난 데이터는 `delete`를 통해 가스 효율성을 높이도록 설계되었습니다.

---

### 마치며

이 프로젝트를 통해 **Truffle을 이용한 스마트 컨트랙트 생명주기 관리**, **Solidity의 가스 최적화**, 그리고 **React와 블록체인 노드를 연결하는 Web3 환경 설정**까지 Dapp 개발의 A to Z를 경험할 수 있었습니다. 

투명한 게임 로직을 직접 구현해 보고 싶다면, 이 Lottery Dapp 구조에서 시작해 보는 것을 추천합니다!
