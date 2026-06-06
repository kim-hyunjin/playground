import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { WalletLibrary } from "./interface/WalletLibrary";
import { KaikasStore } from "./KaikasStore";
import { MetaMaskStore } from "./MetamaskStore";

export type WalletType = "MetaMask" | "Kaikas";

export class RootStore {
  library: WalletLibrary | null = null;
  currentWalletType: WalletType | null = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      const type = window.localStorage.getItem("walletType");
      if (type) {
        this.connect(type as WalletType);
      }
    }
  }

  connect(type: WalletType) {
    this.currentWalletType = type;
    window.localStorage.removeItem("walletType");
    window.localStorage.setItem("walletType", type);
    switch (type) {
      case "MetaMask":
        this.library = new MetaMaskStore();
        break;
      case "Kaikas":
        this.library = new KaikasStore();
        break;
    }
  }
}

export const rootStore = new RootStore();
export const WalletLibraryContext = createContext<RootStore>(rootStore);
