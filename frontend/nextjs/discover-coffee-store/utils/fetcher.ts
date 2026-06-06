export const simpleFetcher = (url: string) =>
  fetch(url).then((res) => res.json());
