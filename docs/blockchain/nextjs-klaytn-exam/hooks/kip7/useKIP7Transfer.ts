import { useCallback } from "react";
import useWalletAddress from "../klaytn/useWalletAddress";
import useKIP7 from "../klaytn/useKIP7";
import useCaver from "../klaytn/useCaver";
import checkTransferable from "../../utils/checkTransferable";

export default function useKIP7Transfer() {
  const walletAddress = useWalletAddress();
  const caver = useCaver();
  const kip7 = useKIP7();

  const transfer = useCallback(
    ({ to, numOfToken }: { to: string; numOfToken: number }) => {
      if (!caver || !kip7 || !walletAddress) return;

      try {
        checkTransferable(walletAddress, to);
        return kip7.transfer(to, caver.utils.toPeb(numOfToken, "KLAY"), {
          from: walletAddress,
        });
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("전송 실패");
        }
      }
    },
    [walletAddress, caver, kip7]
  );

  return transfer;
}
