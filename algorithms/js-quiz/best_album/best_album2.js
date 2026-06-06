class BestAlbum {
  constructor(genres, plays) {
    this.genres = genres;
    this.plays = plays;
    this.album = [];
    this.trackList = [];
    this.setAlbum();
    this.sortAlbum();
    this.setTrackList();
  }

  setAlbum() {
    this.album = this.genres.map((genre, index) => ({
      title: index,
      genre: genre,
      play: this.plays[index],
    }));
  }

  sortAlbum() {
    const totalPlaysByGenre = {};
    this.genres.forEach((genre, index) => {
      totalPlaysByGenre[genre] = totalPlaysByGenre[genre]
        ? totalPlaysByGenre[genre] + this.plays[index]
        : this.plays[index];
    });
    this.album.sort((a, b) => {
      if (a.genre !== b.genre) {
        return totalPlaysByGenre[b.genre] - totalPlaysByGenre[a.genre];
      }
      if (a.play !== b.play) {
        return b.play - a.play;
      }
      return a.title - b.title;
    });
  }

  setTrackList() {
    const songLimitByGenre = 2;
    const songCountByGenre = {};
    this.trackList = this.album
      .filter((song) => {
        if (songCountByGenre[song.genre] >= songLimitByGenre) {
          return false;
        }
        songCountByGenre[song.genre] = songCountByGenre[song.genre]
          ? songCountByGenre[song.genre] + 1
          : 1;
        return true;
      })
      .map((song) => song.title);
  }

  getTrackList() {
    return this.trackList;
  }
}

function solution(genres, plays) {
  var answer = [];
  const bestAlbum = new BestAlbum(genres, plays);
  answer = bestAlbum.getTrackList();
  return answer;
}

// TEST
function main() {
  const genres = ["classic", "pop", "classic", "classic", "pop"];
  const plays = [500, 600, 150, 800, 2500];
  const bestAlbum = new BestAlbum(genres, plays);
  const trackList = bestAlbum.getTrackList();
  console.log(trackList);
}
// main();
