import React, { RefObject } from "react";
import "./App.css";
import Web3 from "web3";
import { lotteryAbi } from "./abi/Lottery";
import { Contract } from "web3-eth-contract";
import EventTable from "./components/EventTable";

declare global {
    interface Window {
        web3: any;
        ethereum: any;
    }
}

type AppState = {
    pot: string;
    challenges: [string, string];
};

const lotteryAddress = "0xffD4c5BfB668874534d12f9D9bE0A98CdA59FdcD";

class App extends React.Component<any, AppState> {
    web3!: Web3;
    account!: string;
    lotteryContract!: Contract;
    firstWordInput: RefObject<HTMLInputElement>;
    secondWordInput: RefObject<HTMLInputElement>;
    interval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);

        this.state = {
            pot: "0",
            challenges: ["", ""],
        };
        this.firstWordInput = React.createRef<HTMLInputElement>();
        this.secondWordInput = React.createRef<HTMLInputElement>();
    }

    async componentDidMount() {
        await this.initWeb3();

        this.getPot();
        setInterval(this.getPot, 3000);
        this.firstWordInput.current?.focus();
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    initWeb3 = async () => {
        this.web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        this.account = accounts[0];
        this.lotteryContract = new this.web3.eth.Contract(lotteryAbi, lotteryAddress);
    };

    bet = () => {
        // const nonce = await this.web3.eth.getTransactionCount(this.account); // 불필요..
        const challenges =
            "0x" + this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();

        this.lotteryContract.methods
            .betAndDistribute(challenges)
            .send({
                from: this.account,
                value: 5 * 10 ** 15,
                gas: 300000,
                // nonce, // ignored by MetaMask
            })
            .on("transactionHash", (hash: any) => {
                alert(`베팅 성공!\n베팅 글자: '${challenges}'\ntransaction hash: ${hash}`);
            });

        this.clearInput("first");
        this.clearInput("second");
    };

    getPot = async () => {
        // 스마트 컨트랙트의 상태를 변경하지 않고, 값만 읽어올 때 call() 호출
        const pot = await this.lotteryContract.methods.getPot().call();
        this.setState({ pot: this.web3.utils.fromWei(pot) });
    };

    handleInputChange = (position: "first" | "second", value: string) => {
        if (value.length > 0 && !value.match(/[0-9]|[a-f]|[A-F]/)) {
            alert(`베팅글자는 0-9 또는 a-f 중에서만 선택할 수 있습니다. 현재 입력값: ${value}`);
            this.clearInput(position);
        }
        if (position === "first") {
            this.setState({
                challenges: [value, this.state.challenges[1]],
            });
        }
        if (position === "second") {
            this.setState({
                challenges: [this.state.challenges[0], value],
            });
        }
    };

    clearInput = (position: "first" | "second") => {
        if (position === "first" && this.firstWordInput.current) {
            this.firstWordInput.current.value = "";
        }

        if (position === "second" && this.secondWordInput.current) {
            this.secondWordInput.current.value = "";
        }
    };

    render(): React.ReactNode {
        return (
            <main>
                <section className="py-5 text-center container">
                    <div className="row py-lg-5">
                        <div className="col-lg-6 col-md-8 mx-auto">
                            <h1 className="fw-bold">Lottery</h1>
                            <h2>Current Pot: {this.state.pot} ETH</h2>
                        </div>
                    </div>
                </section>
                <section className="container text-center">
                    <h2>베팅하기</h2>
                    <p>0~9 a~f (대소문자 구분 없음) 중 값을 입력해주세요.</p>
                    <div className="row d-flex justify-content-center mb-3">
                        <input
                            ref={this.firstWordInput}
                            type="text"
                            className="col-lg-3 col-md-6"
                            id="firstWord"
                            placeholder="첫번째 글자"
                            maxLength={1}
                            onChange={(e) => {
                                this.handleInputChange("first", e.target.value);
                            }}
                        />
                        <input
                            ref={this.secondWordInput}
                            type="text"
                            className="col-lg-3 col-md-6"
                            id="secondWord"
                            placeholder="두번째 글자"
                            maxLength={1}
                            onChange={(e) => {
                                this.handleInputChange("second", e.target.value);
                            }}
                        />
                    </div>
                    <button className="btn btn-danger btn-lg" onClick={this.bet}>
                        베팅
                    </button>
                </section>
                <EventTable web3={this.web3} lotteryContract={this.lotteryContract} />
            </main>
        );
    }
}

export default App;
