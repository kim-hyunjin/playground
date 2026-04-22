import { GetServerSideProps } from "next";
import Link from "next/link";
import SEO from "../components/SEO";

type Movie = {
    id: string;
    original_title: string;
    poster_path: string;
};

export default function Home({ movies }: { movies: Movie[] }) {
    return (
        <div className="container">
            <SEO title="Home"></SEO>
            {movies.map((movie) => {
                return (
                    <Link
                        href={{
                            pathname: `/movies/${movie.id}`,
                            query: {
                                title: movie.original_title,
                            },
                        }}
                        as={`/movies/${movie.id}`}
                        key={movie.id}
                    >
                        <a>
                            <div className="movie">
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                                <h4>{movie.original_title}</h4>
                            </div>
                        </a>
                    </Link>
                );
            })}
            <style jsx>{`
                .container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    padding: 20px;
                    gap: 20px;
                }
                .movie {
                    cursor: pointer;
                }
                .movie img {
                    max-width: 100%;
                    border-radius: 12px;
                    transition: transform 0.2s ease-in-out;
                    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
                }
                .movie:hover img {
                    transform: scale(1.05) translateY(-10px);
                }
                .movie h4 {
                    font-size: 18px;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}

const vercelUrl = process.env.VERCEL_URL;
export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`https://${vercelUrl}/api/movies`);
    const data = await res.json();
    return {
        props: {
            movies: data.results,
        },
    };
};
