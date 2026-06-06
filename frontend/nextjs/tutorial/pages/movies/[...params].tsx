import { GetServerSideProps } from "next";
import SEO from "../../components/SEO";

export default function Detail({ title }: { title: string }) {
    return (
        <>
            <SEO title={title} />
            <h1>{title}</h1>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            title: context.query.title ?? "",
        },
    };
};
