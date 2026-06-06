import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { WalletLibraryContext } from "../../store/RootStore";

const WalletConnector = () => {
  const context = useContext(WalletLibraryContext);
  return (
    <section>
      <button
        onClick={() => {
          context.connect("MetaMask");
        }}
      >
        MetaMask
      </button>
      <button
        onClick={() => {
          context.connect("Kaikas");
        }}
      >
        Kaikas
      </button>
    </section>
  );
};

export default observer(WalletConnector);
