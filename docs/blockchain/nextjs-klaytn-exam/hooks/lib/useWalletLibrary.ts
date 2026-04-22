import { useContext } from "react";
import { WalletLibraryContext } from "../../store/RootStore";

export const useWalletLibrary = () => {
  const { library } = useContext(WalletLibraryContext);
  return library;
};
