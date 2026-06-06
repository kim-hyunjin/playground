function solution(genres, plays) {
  const answer = [];

  const album = genres.reduce((albumObj, value, i) => {
    if (albumObj[value]) {
      albumObj[value].totalPlays = albumObj[value].totalPlays + plays[i];
      albumObj[value].songs[i] = plays[i];
    } else {
      albumObj[value] = { totalPlays: plays[i], songs: { [i]: plays[i] } }; // 파라미터 i를 key로 사용하기
    }
    return albumObj;
  }, {});

  const songsRankedByGenre = Object.values(album)
    .sort((a, b) => b.totalPlays - a.totalPlays)
    .map((genreWithSongs) => genreWithSongs.songs);

  const songsRankedByPlays = songsRankedByGenre.map((songs) =>
    Object.keys(songs).sort((a, b) => songs[b] - songs[a])
  );

  songsRankedByPlays.forEach((v) => {
    if (v[0]) answer.push(v[0] * 1);
    if (v[1]) answer.push(v[1] * 1);
  });

  return answer;
}

// TEST
function main() {
  const genres = ["classic", "pop", "classic", "classic", "pop"];
  const plays = [500, 600, 150, 800, 2500];
  const trackList = solution(genres, plays);
  console.log(trackList);
}
main();
