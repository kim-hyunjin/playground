import { AbiItem } from "web3-utils";

export const lotteryAbi: AbiItem[] = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "BET",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "answer",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "DRAW",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "answer",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "FAIL",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "REFUND",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "bytes1",
                name: "answer",
                type: "bytes1",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
        ],
        name: "WIN",
        type: "event",
    },
    {
        inputs: [],
        name: "answerForTest",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address payable",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
        ],
        name: "betAndDistribute",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "payable",
        type: "function",
        payable: true,
    },
    {
        inputs: [
            {
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
        ],
        name: "bet",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "payable",
        type: "function",
        payable: true,
    },
    {
        inputs: [],
        name: "distribute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getPot",
        outputs: [
            {
                internalType: "uint256",
                name: "pot",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getBetInfo",
        outputs: [
            {
                internalType: "uint256",
                name: "answerBlockNumber",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "gambler",
                type: "address",
            },
            {
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "bytes1",
                name: "challenges",
                type: "bytes1",
            },
            {
                internalType: "bytes32",
                name: "answer",
                type: "bytes32",
            },
        ],
        name: "isMatch",
        outputs: [
            {
                internalType: "enum Lottery.BettingResult",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "pure",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "answer",
                type: "bytes32",
            },
        ],
        name: "setAnswerForTest",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
