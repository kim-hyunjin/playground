import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useWalletLibrary } from "../../hooks/lib/useWalletLibrary";

const Form = () => {
  const library = useWalletLibrary();
  const [toAddress, setToAddress] = useState("");
  const [klay, setKlay] = useState(0);

  const kalySendHandler = () => {
    library?.transfer(toAddress, klay);
  };
  return (
    <section>
      <h3>보내는 주소</h3>
      <input
        placeholder="address"
        onChange={(e) => {
          setToAddress(e.target.value);
        }}
      ></input>
      <h3>Send Klay</h3>
      <input
        type={"number"}
        placeholder="klay"
        onChange={(e) => {
          setKlay(Number(e.target.value));
        }}
      ></input>
      <button
        onClick={() => {
          kalySendHandler();
        }}
      >
        전송
      </button>
      <h3>Send Token</h3>
      <input type={"number"} placeholder="TTH1" onChange={(e) => {}}></input>
      <button onClick={() => {}}>전송</button>
    </section>
  );
};

export default observer(Form);
