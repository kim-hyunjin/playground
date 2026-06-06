import { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css"; // _app 컴포넌트에서만 global css를 import 할 수 있다. 그 외 컴포넌트에서는 module.css 를 import해서 적용해야한다.

/**
 * This App component is the top-level component which will be common across all the different pages.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}
