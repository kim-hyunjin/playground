package com.github.kimhyunjin.inflearn.sortandsearch;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class MusicVideoTest {

    @Test
    public void test() {
        MusicVideo musicVideo = new MusicVideo();
        int[] songs = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9};
        int numOfAlbum = 3;
        int actual = musicVideo.solution(songs, numOfAlbum);
        int expected = 17;

        Assertions.assertEquals(expected, actual);
    }
}
