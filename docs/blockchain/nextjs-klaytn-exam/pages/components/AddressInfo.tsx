import Caver from "caver-js";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useWalletLibrary } from "../../hooks/lib/useWalletLibrary";

const AddressInfo = () => {
  const library = useWalletLibrary();
  // const [balance, setBalance] = useState("0");
  // const [address, setAddress] = useState("");
  // const [caver, setCaver] = useState<Caver | undefined>(undefined);
  // useEffect(() => {
  //   window.klaytn.enable().then((accounts: string[]) => {
  //     setAddress(accounts[0]);
  //     setCaver(new Caver(window.klaytn));
  //   });
  //   window.klaytn.on("accountsChanged", (accounts: string[]) => {
  //     setAddress(accounts[0]);
  //   });
  //   window.klaytn.on("networkChanged", (networkId: string) => {
  //     console.log("network changed to: ", networkId);
  //   });
  // }, []);
  // useEffect(() => {
  //   if (!caver || !caver.utils.isAddress(address)) return;

  //   caver.klay.getBalance(address).then((b) => {
  //     setBalance(b);
  //   });
  // }, [caver, address]);

  return (
    <>
      {/* <h1>{address}</h1> */}
      {/* <h3>{balance}</h3> */}
      {library?.active ? (
        <>
          <h1>{library.address}</h1>
          <h2>잔액: {library.balance}</h2>
        </>
      ) : (
        <h1>지갑을 연결해주세요.</h1>
      )}
    </>
  );
};

export default observer(AddressInfo);
