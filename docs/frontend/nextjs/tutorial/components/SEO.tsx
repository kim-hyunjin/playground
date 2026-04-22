import Head from "next/head";

export default function SEO({ title }: { title: string }) {
    return (
        <Head>
            <title>{title} | Next Movies</title>
        </Head>
    );
}
