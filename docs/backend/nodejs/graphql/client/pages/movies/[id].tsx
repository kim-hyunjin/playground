import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import styled from 'styled-components';
import { GET_MOVIE } from '../../graphql/query';
import { MovieData } from '../../graphql/types';

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 28px;
`;

interface CoverImageProps {
  readonly bg: string;
}

const CoverImage = styled.div<CoverImageProps>`
  width: 25%;
  height: 60%;
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  border-radius: 7px;
`;

const Movie: NextPage = () => {
  const router = useRouter();
  const movieId = router.query.id;
  const {
    data,
    loading,
    error,
    client: { cache },
  } = useQuery<MovieData>(GET_MOVIE, { variables: { movieId } });

  const handleClick = () => {
    cache.writeFragment({
      id: `Movie:${movieId}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: !data?.movie?.isLiked,
      },
    });
  };

  return (
    <Container>
      <Column>
        <Title>{loading ? 'Loading...' : `${data?.movie?.title}`}</Title>
        <Subtitle>⭐️ {data?.movie?.rating}</Subtitle>
        <button onClick={handleClick}>{data?.movie?.isLiked ? 'Unlike' : 'Like'}</button>
      </Column>
      <CoverImage bg={data?.movie?.medium_cover_image ?? ''} />
    </Container>
  );
};

export default Movie;
