package com.github.kimhyunjin.programmers.hash;

import java.util.*;

public class HashQuiz4 {

    public static void main(String[] args) {
        String[] genres = {"classic", "pop", "classic", "classic", "pop"};
        int[] plays = {500, 600, 150, 800, 2500};
        int[] answer = solution(genres, plays);
        System.out.println(Arrays.toString(answer));
    }

    public static int[] solution(String[] genres, int[] plays) {
        Map<String, ClassifiedSongs> songsMap = new HashMap<>();
        for (int i = 0; i < genres.length; i++) {
            if (songsMap.containsKey(genres[i])) {
                songsMap.get(genres[i]).songs.add(new Song(i, plays[i]));
                songsMap.get(genres[i]).totalPlays += plays[i];
            } else {
                songsMap.put(genres[i], new ClassifiedSongs(genres[i], new Song(i, plays[i])));
            }
        }
        return songsMap.values().stream()
                .sorted().flatMap(classifiedSongs ->
                        classifiedSongs.songs.stream().sorted().limit(2)
                ).mapToInt(song -> song.id).toArray();
    }

    static class ClassifiedSongs implements Comparable<ClassifiedSongs> {
        public String genre;
        public List<Song> songs;
        public int totalPlays;

        public ClassifiedSongs(String genre, Song song) {
            this.genre = genre;
            this.songs = new ArrayList<>();
            this.songs.add(song);
            this.totalPlays = song.plays;
        }

        @Override
        public int compareTo(ClassifiedSongs other) {
            return other.totalPlays - this.totalPlays;
        }
    }

    static class Song implements Comparable<Song> {
        public int id;
        public int plays;

        public Song(int id, int plays) {
            this.id = id;
            this.plays = plays;
        }

        @Override
        public int compareTo(Song other) {
            if (this.plays == other.plays) {
                return this.id - other.id;
            } else {
                return other.plays - this.plays;
            }
        }
    }
}
