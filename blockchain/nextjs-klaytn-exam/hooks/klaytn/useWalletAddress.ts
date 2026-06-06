import { useEffect, useState } from "react";

export default function useWalletAddress() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.klaytn !== "undefined") {
      try {
        window.klaytn.enable().then((accounts: string[]) => {
          setAddress(accounts[0]);
        });
        window.klaytn.on("accountsChanged", (accounts: string[]) => {
          setAddress(accounts[0]);
        });
      } catch (e) {
        alert("kaikas wallet 연결 중 실패");
      }
    }
  }, []);

  return address;
}
