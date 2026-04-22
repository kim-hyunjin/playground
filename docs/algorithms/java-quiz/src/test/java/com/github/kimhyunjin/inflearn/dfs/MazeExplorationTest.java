package com.github.kimhyunjin.inflearn.dfs;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class MazeExplorationTest {

    @Test
    public void test() {
        int expected = 8;

        int mazeSize = 7;
        int[][] maze = new int[][]{
                {0, 0, 0, 0, 0, 0, 0},
                {0, 1, 1, 1, 1, 1, 0},
                {0, 0, 0, 1, 0, 0, 0},
                {1, 1, 0, 1, 0, 1, 1},
                {1, 1, 0, 0, 0, 0, 1},
                {1, 1, 0, 1, 1, 0, 0},
                {1, 0, 0, 0, 0, 0, 0}
        };
        MazeExploration mazeExploration = new MazeExploration(maze, new int[]{0,0}, new int[]{6, 6});
        mazeExploration.DFS(0, 0);
        Assertions.assertEquals(expected, mazeExploration.answer);
    }
}
