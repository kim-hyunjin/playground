export const users = [
  {
    id: '1',
    lastName: 'Kim',
    firstName: 'Hyunjin',
  },
  {
    id: '2',
    lastName: 'Doe',
    firstName: 'John',
  },
];

export let tweets = [
  {
    id: '1',
    text: 'hello',
    userId: '1',
  },
  {
    id: '2',
    text: 'how are you?',
    userId: '2',
  },
];

export const updateTweets = (newTweets) => {
  tweets = newTweets;
};
