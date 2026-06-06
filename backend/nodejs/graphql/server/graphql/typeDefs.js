import { gql } from 'apollo-server';

// SDL (Schema Definition Language)
export const typeDefs = gql`
  type Query {
    """
    Get all the Tweets
    """
    allTweets: [Tweet!]!
    """
    Get Tweet with id
    """
    tweet(id: ID!): Tweet
    """
    Get all the Users
    """
    allUsers: [User!]!
    """
    Get all the movies
    """
    allMovies: [Movie!]!
    """
    Get movie with id
    """
    movie(id: String!): Movie
  }

  type Mutation {
    """
    Create a Tweet, and return created Tweet
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }

  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String
    """
    Is the sum of first name + last name as a string
    """
    fullname: String!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;
