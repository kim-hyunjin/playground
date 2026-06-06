import { useEffect, useState } from "react";
import useCaver from "../klaytn/useCaver";
import useWalletAddress from "../klaytn/useWalletAddress";

export default function useGetBalance() {
  const caver = useCaver();
  const walletAddress = useWalletAddress();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!caver || !walletAddress) return;

    caver.klay.getBalance(walletAddress).then((balance) => {
      const converted = caver.utils.fromPeb(balance, "KLAY");
      setBalance(Number(converted));
    });
  }, [caver, walletAddress]);

  return balance;
}
