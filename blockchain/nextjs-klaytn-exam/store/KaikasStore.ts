import Caver from "caver-js";
import { action, autorun, makeAutoObservable, runInAction } from "mobx";
import { WalletLibrary } from "./interface/WalletLibrary";

export class KaikasStore implements WalletLibrary {
  private caver: Caver | null = null;
  active: boolean = false;
  balance: string = "";
  address: string = "";

  constructor() {
    makeAutoObservable(this);

    if (typeof window.klaytn === "undefined") {
      alert("Kaikas 지갑이 필요합니다.");
      window.open(
        "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
      );
      return;
    }

    try {
      this.caver = new Caver(window.klaytn);

      window.klaytn.enable().then(
        action((accounts: string[]) => {
          this.address = accounts[0];
          this.active = true;
        })
      );
      window.klaytn.selectedAddress;
      window.klaytn.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          console.log("계정을 가져오는 중 에러");
        } else {
          runInAction(() => (this.address = accounts[0]));
          console.log("address changed to: ", accounts[0]);
        }
      });
      window.klaytn.on("networkChanged", (chainId: string) => {
        this.fetchBalance();
        console.log("network changed to: ", chainId);
      });
      // this.caver.klay.getGasPrice().then(console.log);
    } catch (e) {
      alert("Kaikas 연결 중 실패");
    }

    autorun(() => this.fetchBalance());
  }

  transfer(to: string, value: number) {
    this.caver?.klay.sendTransaction({
      type: "VALUE_TRANSFER",
      from: this.address,
      to,
      value: this.caver.utils.toPeb(String(value), "KLAY"),
      gas: "21000",
    });
  }

  async getBalanceOf(address: string) {
    if (!this.caver || !this.caver.utils.isAddress(address)) return;

    try {
      const newBalance = await this.caver.klay.getBalance(address);
      if (Number(newBalance) < 0) {
        console.log("잔액 정보를 가져오는 중 에러 발생");
        return "";
      }

      return this.caver.utils.fromPeb(newBalance, "KLAY");
    } catch (e) {
      console.log(e);
    }
  }

  fetchBalance = () => {
    this.getBalanceOf(this.address).then(
      action((newBalance: string | undefined) => {
        this.balance = newBalance || "";
      })
    );
  };
}
