export const formatDate = (date: Date) => {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const formatPlayTime = (seconds: number): string => {
  return new Date(seconds * 1000).toTimeString().substring(3, 8);
};
