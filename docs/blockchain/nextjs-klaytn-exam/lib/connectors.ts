import { InjectedConnector } from "@web3-react/injected-connector";
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1001, // klaytn baobab network
    8217, // klaytn Cypress network
  ],
});
