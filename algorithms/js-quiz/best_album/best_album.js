class BestAlbum {
  constructor(genres, plays) {
    this.genres = genres;
    this.plays = plays;
    this.album = [];
    this.trackList = [];
    this.setAlbum();
    this.sortAlbumByGenre();
    this.sortSongsInGenreByPlays();
    this.setTrackList();
  }

  setTrackList() {
    this.album.forEach((el) => {
      if (el.songs.length > 1) {
        for (let i = 0; i < 2; i++) {
          this.trackList.push(el.songs[i].title);
        }
      } else {
        this.trackList.push(el.songs[0].title);
      }
    });
  }

  getTrackList() {
    return this.trackList;
  }

  setAlbum() {
    for (let genre of this.genres) {
      if (this.album.findIndex((el) => el.genre === genre) == -1) {
        this.album.push({
          genre: genre,
          songs: [],
          totalPlays: 0,
        });
      }
    }
    for (let i = 0; i < this.plays.length; i++) {
      this.album.forEach((el) => {
        if (el.genre === this.genres[i]) {
          el.songs.push({
            title: i,
            plays: this.plays[i],
          });
          el.totalPlays += this.plays[i];
        }
      });
    }
  }

  sortAlbumByGenre() {
    this.album.sort(function (a, b) {
      if (a.totalPlays > b.totalPlays) {
        return -1;
      } else if (a.totalPlays < b.totalPlays) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  sortSongsInGenreByPlays() {
    this.album.forEach((el) => {
      el.songs.sort(function (a, b) {
        if (a.plays > b.plays) {
          return -1;
        } else if (a.plays < b.plays) {
          return 1;
        } else {
          if (a.title > b.title) {
            return 1;
          } else if (a.title < b.title) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    });
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
