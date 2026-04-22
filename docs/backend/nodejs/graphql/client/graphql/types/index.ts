export interface Movie {
  id: number;
  title: string;
  medium_cover_image: string;
  rating: number;
  isLiked: boolean;
}

export interface AllMovies {
  allMovies: Movie[];
}

export interface MovieData {
  movie: Movie;
}
