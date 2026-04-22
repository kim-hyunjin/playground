import { useCallback } from "react";
import checkTransferable from "../../utils/checkTransferable";
import useCaver from "../klaytn/useCaver";
import useWalletAddress from "../klaytn/useWalletAddress";

export default function useKlayTransfer() {
  const walletAddress = useWalletAddress();
  const caver = useCaver();

  const transfer = useCallback(
    ({ to, klay }: { to: string; klay: number }) => {
      if (!caver || !walletAddress) return;

      try {
        return caver.klay.sendTransaction({
          type: "VALUE_TRANSFER",
          from: walletAddress,
          to,
          value: caver.utils.toPeb(String(klay), "KLAY"),
          gas: "21000",
        });
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("전송 실패");
        }
      }
    },
    [walletAddress, caver]
  );

  return transfer;
}
