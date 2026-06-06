# Truffle로 Dapp 만들기

## How to

1. 프로젝트 초기설정

```
$ truffle init
```

2. contracts 폴더에 contract 작성

3. 컴파일

```
$ truffle compile
```

4. migrations 폴더에 migrate를 위한 js 파일 작성
5. truffle-config.js에 network 정보 설정
6. migrate

```
$ truffle migrate
```

7. 확인(스마트 컨트랙트와 상호작용)

```
$ truffle console

$ Lottery.deployed().then(function(instance){ lot=instance })
$ lot.abi
$ lot.owner()
$ lot.getSomeValue()
...
```

## 테스트 하기

test/ 폴더 밑에 test를 위한 js파일 생성

```
$ truffle test
```

## GAS 계산

수수료 = gas(gasLimit) \*\* gasPrice

```
ex)
gas(21000) * gasPrice(1 gwei == 10 ** 9 wei)
= 21000000000 wei == 0.000021 ETH

1 ETH = 10 ** 18 wei
```

수수료가 높을 수록 miner가 빨리 처리해준다.

### gas는 언제 소모되나?

```
32bytes 데이터를 새로 저장 시 20000 gas 소모
32bytes 기존 변수에 있는 값을 바꿀 때 5000 gas 소모
기존 변수를 초기화해서 더 쓰지 않을 때 10000 gas 리턴

** 현재시점의 정확한 gas 소모량이 아님.
```

### Lottery 컨트랙트의 gas 사용량 보기

```
$ truffle console
$ Lottery.deployed().then(function(instance){ lot=instance })
$ let gambler = '0x561934b95ffC1F13706ab20ff7243D515242b5ed'
$ lot.bet("0xab", {from:gambler, value: 5 * 10 ** 15, gas: 300000})

{
  tx: '0xd976cd8fa969eb9913b59b1f79fc20724eda540d3066e297847e2ee02c732da9',
  receipt: {
    transactionHash: '0xd976cd8fa969eb9913b59b1f79fc20724eda540d3066e297847e2ee02c732da9',
    transactionIndex: 0,
    blockHash: '0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7',
    blockNumber: 217,
    from: '0x561934b95ffc1f13706ab20ff7243d515242b5ed',
    to: '0x2ab14b2bd3cd43b2e037d1a3a5c02e5b1bdb8d26',
    gasUsed: 111364, // <= 가스 사용량
    cumulativeGasUsed: 111364,
    contractAddress: null,
    logs: [ [Object] ],
    status: true,
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      logIndex: 0,
      transactionIndex: 0,
      transactionHash: '0xd976cd8fa969eb9913b59b1f79fc20724eda540d3066e297847e2ee02c732da9',
      blockHash: '0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7',
      blockNumber: 217,
      address: '0x2aB14B2bD3Cd43B2E037d1a3A5C02e5b1bdB8d26',
      type: 'mined',
      id: 'log_124d6701',
      event: 'BET',
      args: [Result]
    }
  ]
}
```
