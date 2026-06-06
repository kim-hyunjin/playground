---
title: "파이썬과 솔리디티로 만드는 나만의 암호화폐"
date: 2026-04-24
category: Blockchain
tags: [Python, Solidity, Blockchain, Cryptocurrency, PoW, Smart Contract]
summary: "파이썬을 이용한 블록체인 설계부터 솔리디티 스마트 컨트랙트를 통한 ICO 구현까지, HJCoin의 전체 구현 과정을 살펴봅니다."
---

# 파이썬과 솔리디티로 만드는 나만의 암호화폐

블록체인 기술의 핵심 원리를 이해하는 가장 좋은 방법은 직접 만들어보는 것입니다. 이번 포스트에서는 파이썬(Python)을 이용해 블록체인의 기본 구조와 탈중앙화 메커니즘을 구현하고, 솔리디티(Solidity)로 ICO(Initial Coin Offering) 스마트 컨트랙트를 작성하는 과정을 정리해 보겠습니다.

---

### 1. 블록체인의 기본 구조 설계

모든 블록체인은 연결된 '블록'들의 리스트입니다. 각 블록은 인덱스, 타임스탬프, 증명(Proof), 이전 블록의 해시값, 그리고 트랜잭션 데이터를 포함합니다.

```python
class Blockchain:
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof=1, previous_hash="0") # 제네시스 블록
        self.nodes = set()

    def create_block(self, proof, previous_hash):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": str(datetime.datetime.now()),
            "proof": proof,
            "previous_hash": previous_hash,
            "transactions": self.transactions,
        }
        self.transactions = [] # 블록 생성 후 트랜잭션 풀 비우기
        self.chain.append(block)
        return block
```

---

### 2. 작업 증명 (Proof of Work)

새로운 블록을 체인에 추가하기 위해서는 복잡한 수학 문제를 풀어야 합니다. 이를 '채굴(Mining)'이라고 하며, 여기선 단순하게 SHA-256 해시값의 앞자리가 `0000`으로 시작하는 값을 찾는 방식을 사용합니다.

```python
def check_proof(self, previous_proof, proof):
    hash_operation = hashlib.sha256(
        str(proof**2 - previous_proof**2).encode()
    ).hexdigest()
    return hash_operation[:4] == "0000"

def proof_of_work(self, previous_proof):
    new_proof = 1
    is_proof_valid = False
    while is_proof_valid is False:
        is_proof_valid = self.check_proof(previous_proof, new_proof)
        if not is_proof_valid:
            new_proof += 1
    return new_proof
```

---

### 3. 트랜잭션과 탈중앙화 합의 알고리즘

암호화폐로서 기능을 하기 위해 트랜잭션 추가 기능과 여러 노드 간의 데이터 일치(Consensus)를 위한 알고리즘이 필요합니다. 여기선 '가장 긴 체인이 승리한다(Longest Chain Rule)'는 원칙을 따릅니다.

```python
def replace_chain(self):
    network = self.nodes
    longest_chain = None
    max_length = len(self.chain)
    for node in network:
        response = requests.get(f"http://{node}/get_chain")
        if response.status_code == 200:
            length = response.json()["length"]
            chain = response.json()["chain"]
            if length > max_length and self.is_chain_valid(chain):
                max_length = length
                longest_chain = chain
    if longest_chain:
        self.chain = longest_chain
        return True
    return False
```

---

### 4. 스마트 컨트랙트를 이용한 ICO 구현

블록체인 네트워크 위에서 코인을 배포하고 투자자들이 코인을 구매할 수 있도록 이더리움 기반의 솔리디티 컨트랙트를 작성합니다.

```solidity
// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

contract hjcoin_ico {
    uint public max_hjcoins = 100000;
    uint public usd_to_hjcoins = 1000;
    uint public total_hjcoins_bought = 0;

    mapping(address => uint) equity_hjcoins;
    mapping(address => uint) equity_usd;

    modifier can_buy_hjcoins(uint usd_invested) {
        require(usd_invested * usd_to_hjcoins + total_hjcoins_bought <= max_hjcoins);
        _;
    }

    function buy_hjcoins(address investor, uint usd_invested) external can_buy_hjcoins(usd_invested) {
        uint hjcoins_bought = usd_invested * usd_to_hjcoins;
        equity_hjcoins[investor] += hjcoins_bought;
        equity_usd[investor] += usd_invested;
        total_hjcoins_bought += hjcoins_bought;
    }
}
```

---

### 마치며

HJCoin 프로젝트를 통해 블록체인의 데이터 무결성 검증, 작업 증명을 통한 보안 확보, 그리고 스마트 컨트랙트를 통한 자동화된 자산 관리의 기본 원리를 살펴보았습니다. 파이썬의 Flask 프레임워크를 활용하면 이러한 복잡한 백엔드 로직을 웹 API 형태로 쉽게 노출하여 실제 서비스처럼 테스트해 볼 수 있습니다.

```python
import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse


# Part 1 - Building a Blockchain
class Blockchain:
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof=1, previous_hash="0")
        self.nodes = set()

    def create_block(self, proof, previous_hash):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": str(datetime.datetime.now()),
            "proof": proof,
            "previous_hash": previous_hash,
            "transactions": self.transactions,
        }
        self.transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        is_proof_valid = False
        while is_proof_valid is False:
            is_proof_valid = self.check_proof(previous_proof, new_proof)
            if not is_proof_valid:
                new_proof += 1
        return new_proof

    def check_proof(self, previous_proof, proof):
        # 더 복잡한 계산식을 이용해 난이도를 높일 수 있음
        hash_operation = hashlib.sha256(
            str(proof**2 - previous_proof**2).encode()
        ).hexdigest()
        # leading zero의 개수가 많을수록 난이도가 높음
        return hash_operation[:4] == "0000"

    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block["previous_hash"] != self.hash(previous_block):
                return False

            is_proof_valid = self.check_proof(previous_block["proof"], block["proof"])
            if not is_proof_valid:
                return False

            previous_block = block
            block_index += 1
        return True

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def add_transaction(self, sender, receiver, amount):
        """
        return: 트랜잭션이 추가될 블록 넘버
        """
        self.transactions.append(
            {
                "sender": sender,
                "receiver": receiver,
                "amount": amount,
            }
        )
        previous_block = self.get_previous_block()
        return previous_block["index"] + 1

    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f"http://{node}/get_chain")
            if response.status_code == 200:
                length = response.json()["length"]
                chain = response.json()["chain"]
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False


# Part 2 - Mining our Blockchain

# Creating a Web App
app = Flask(__name__)
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False

node_address = str(uuid4()).replace("-", "")

# Creating a Blockchain
blockchain = Blockchain()


@app.route("/get_chain", methods=["GET"])
def get_chain():
    response = {"chain": blockchain.chain, "length": len(blockchain.chain)}
    return jsonify(response), 200


@app.route("/mine_block", methods=["GET"])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block["proof"]
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    blockchain.add_transaction(sender=node_address, receiver="HJ", amount=1)
    block = blockchain.create_block(proof, previous_hash)
    response = {
        "message": "Congratulations, you just mined a block!",
        "index": block["index"],
        "timestamp": block["timestamp"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"],
        "transactions": block["transactions"],
    }
    return jsonify(response), 200


@app.route("/is_valid", methods=["GET"])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    response = {"is_valid": is_valid}
    return jsonify(response), 200


@app.route("/add_transaction", methods=["POST"])
def add_transaction():
    json = request.get_json()
    transaction_keys = ["sender", "receiver", "amount"]
    if not all(key in json for key in transaction_keys):
        return "Some elements of the transaction are missing", 400
    index = blockchain.add_transaction(json["sender"], json["receiver"], json["amount"])
    response = {"message": f"This transaction will be added to Block {index}"}
    return jsonify(response), 201


# Part 3 - Decentralizing our Blockchain
@app.route("/connect_node", methods=["POST"])
def connect_node():
    json = request.get_json()
    nodes = json.get("nodes")
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {
        "message": "All the nodes are now connected. The HJCoin Blockchain now contains the following nodes:",
        "total_nodes": list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route("/replace_chain", methods=["GET"])
def replace_chain():
    is_replaced = blockchain.replace_chain()
    response = {"is_replaced": is_replaced, "chain": blockchain.chain}
    return jsonify(response), 200


app.run(host="0.0.0.0", port=5001)

```
