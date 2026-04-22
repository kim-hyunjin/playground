import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { injectedConnector } from "../../lib/connectors";

export default function useMetamask() {
  const web3React = useWeb3React();

  useEffect(() => {
    if (!web3React.active) {
      injectedConnector.isAuthorized().then((isAuthorized) => {
        if (isAuthorized && !web3React.error) {
          web3React.activate(injectedConnector);
        }
      });
    }
  }, [web3React, web3React.active]);

  return web3React;
}
