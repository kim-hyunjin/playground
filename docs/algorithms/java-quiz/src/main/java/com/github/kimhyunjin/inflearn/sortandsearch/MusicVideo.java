package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.Arrays;
import java.util.Scanner;

/**
 * 결정 알고리즘
 */
public class MusicVideo {

    public int solution(int[] songs, int numOfAlbum) {
        int answer = 0;
        int lt = Arrays.stream(songs).max().getAsInt();
        int rt = Arrays.stream(songs).sum();
        while (lt <= rt) {
            int mid = (lt + rt) / 2;
            if(isAllSongsCanStore(songs, mid, numOfAlbum)) {
                answer = mid;
                rt = mid - 1; // 더 좋은 답이 있는지 찾기
            } else {
                lt = mid + 1;
            }
        }
        return answer;
    }

    // 유효함수
    private boolean isAllSongsCanStore(int[] songs, int capacity, int numOfAlbum) {
        int currentAlbumCnt = 1, sum = 0;
        for (int song : songs) {
            if (sum + song > capacity) {
                currentAlbumCnt++;
                sum = song;
            } else {
                sum += song;
            }
        }
        return numOfAlbum >= currentAlbumCnt;
    }

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int numOfSongs = in.nextInt();
        int numOfAlbum = in.nextInt();
        int[] songs = new int[numOfSongs];
        for (int i = 0; i < numOfSongs; i++) {
            songs[i] = in.nextInt();
        }

        MusicVideo musicVideo = new MusicVideo();
        System.out.println(musicVideo.solution(songs, numOfAlbum));
        return ;
    }
}
