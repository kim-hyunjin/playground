import { tweets, users } from '../data.js';
import fetch from 'node-fetch';

const queryResolver = {
  allTweets() {
    return tweets;
  },
  tweet(_, { id }) {
    return tweets.find((tweet) => tweet.id === id);
  },
  allUsers() {
    return users;
  },
  allMovies() {
    return fetch('https://yts.mx/api/v2/list_movies.json')
      .then((r) => r.json())
      .then((json) => json.data.movies);
  },
  movie(_, { id }) {
    return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
      .then((r) => r.json())
      .then((json) => json.data.movie);
  },
};

const mutationResolver = {
  postTweet(_, { text, userId }) {
    const newTweet = {
      id: tweets.length + 1,
      text,
      userId,
    };
    tweets.push(newTweet);
    return newTweet;
  },
  deleteTweet(_, { id }) {
    const tweet = tweets.find((tweet) => tweet.id === id);
    if (!tweet) return false;

    tweets = tweets.filter((tweet) => tweet.id !== id);
    return true;
  },
};

const userResolver = {
  fullname(root) {
    return `${root.firstName} ${root.lastName}`;
  },
};

const tweetResolver = {
  author(root) {
    return users.find((user) => user.id === root.userId);
  },
};

export const resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
  User: userResolver,
  Tweet: tweetResolver,
};
