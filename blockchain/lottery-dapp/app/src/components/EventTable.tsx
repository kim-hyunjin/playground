import React from "react";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import { clearInterval } from "timers";

type EventRecord = {
    index: string;
    gambler?: string;
    challenges?: string;
    answer?: string;
    betBlockNumber?: string;
    targetBlockNumber?: string;
    amount?: string;
    status: "WIN" | "FAIL" | "DRAW" | "NotRevealed";
};

type EventTableProp = {
    web3: Web3;
    lotteryContract: Contract;
};

type EventTableState = {
    betRecords: EventRecord[];
    winRecords: EventRecord[];
    failRecords: EventRecord[];
    drawRecords: EventRecord[];
    finalRecords: EventRecord[];
};

async function getRecords(type: "BET" | "WIN" | "FAIL" | "DRAW", contract: Contract) {
    const events = await contract.getPastEvents(type, {
        fromBlock: 0,
        toBlock: "latest",
    });

    const records: EventRecord[] = events.reverse().map((e) => {
        const record: EventRecord = {
            index: parseInt(e.returnValues.index, 10).toString(),
            status: type === "BET" ? "NotRevealed" : type,
        };
        if (type === "BET") {
            record["gambler"] =
                e.returnValues.gambler.slice(0, 4) + "..." + e.returnValues.gambler.slice(40, 42);
            record["betBlockNumber"] = String(e.blockNumber);
            record["targetBlockNumber"] = e.returnValues.answerBlockNumber.toString();
            record["challenges"] = e.returnValues.challenges;
        } else {
            record["answer"] = e.returnValues.answer;
            if (type === "WIN") {
                record["amount"] = String(e.returnValues.amount);
            }
        }

        return record;
    });

    // console.log(type, records);
    return records;
}

export default class EventTable extends React.Component<EventTableProp, EventTableState> {
    interval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);

        this.state = {
            betRecords: [],
            winRecords: [],
            failRecords: [],
            drawRecords: [],
            finalRecords: [],
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.pollData, 3000);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    pollData = async () => {
        if (!this.props.web3 || !this.props.lotteryContract) {
            return;
        }
        await this.getBetEvents();
        await this.getWinEvents();
        await this.getFailEvents();
        await this.getDrawEvents();
        this.makeFinalRecords();
    };

    makeFinalRecords = () => {
        let f = 0,
            w = 0,
            d = 0;
        const records = [...this.state.betRecords];
        for (const record of records) {
            if (this.isWin(record, w)) {
                this.mergeWinRecordData(this.state.winRecords[w], record);

                if (w < this.state.winRecords.length - 1) w++;
            }

            if (this.isFail(record, f)) {
                this.mergeFailRecordData(this.state.failRecords[f], record);

                if (f < this.state.failRecords.length - 1) f++;
            }

            if (this.isDraw(record, d)) {
                this.mergeDrawRecordData(this.state.drawRecords[d], record);

                if (d < this.state.drawRecords.length - 1) d++;
            }
        }
        this.setState({ finalRecords: records });
    };

    getBetEvents = async () => {
        const records = await getRecords("BET", this.props.lotteryContract);
        this.setState({ betRecords: records });
    };

    getWinEvents = async () => {
        const records = await getRecords("WIN", this.props.lotteryContract);
        this.setState({ winRecords: records });
    };

    getFailEvents = async () => {
        const records = await getRecords("FAIL", this.props.lotteryContract);
        this.setState({ failRecords: records });
    };

    getDrawEvents = async () => {
        const records = await getRecords("DRAW", this.props.lotteryContract);
        this.setState({ drawRecords: records });
    };

    isWin = (bet: EventRecord, pointer: number): boolean => {
        return (
            this.state.winRecords.length > 0 && bet.index === this.state.winRecords[pointer].index
        );
    };

    isFail = (bet: EventRecord, pointer: number): boolean => {
        return (
            this.state.failRecords.length > 0 && bet.index === this.state.failRecords[pointer].index
        );
    };

    isDraw = (bet: EventRecord, pointer: number): boolean => {
        return (
            this.state.drawRecords.length > 0 && bet.index === this.state.drawRecords[pointer].index
        );
    };

    mergeWinRecordData = (from: EventRecord, to: EventRecord) => {
        to.status = from.status;
        to.answer = from.answer;
        to.amount = this.props.web3.utils.fromWei(
            this.props.web3.utils.toBN(String(from.amount)),
            "ether"
        );
    };

    mergeFailRecordData = (from: EventRecord, to: EventRecord) => {
        to.status = from.status;
        to.answer = from.answer;
    };

    mergeDrawRecordData = (from: EventRecord, to: EventRecord) => {
        to.status = from.status;
        to.answer = from.answer;
    };

    render() {
        return (
            <section className="container text-center mt-5">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Address</th>
                            <th>Challenges</th>
                            <th>Answer</th>
                            <th>Pot</th>
                            <th>Status</th>
                            <th>AnswerBlockNumber</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.finalRecords.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td>{record.index}</td>
                                    <td>{record.gambler}</td>
                                    <td>{record.challenges}</td>
                                    <td>{record.answer}</td>
                                    <td>{record.amount}</td>
                                    <td>{record.status}</td>
                                    <td>{record.targetBlockNumber}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        );
    }
}
