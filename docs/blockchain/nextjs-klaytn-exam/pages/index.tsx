import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import AddressInfo from "./components/AddressInfo";
import Form from "./components/Form";
import WalletConnector from "./components/WalletConnector";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <WalletConnector />
      <AddressInfo />
      <Form />
    </div>
  );
};

export default Home;
