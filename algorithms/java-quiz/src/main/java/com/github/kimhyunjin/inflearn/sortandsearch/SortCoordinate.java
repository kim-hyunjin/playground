package com.github.kimhyunjin.inflearn.sortandsearch;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class SortCoordinate {

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int N = in.nextInt();
        List<Coordinate> coordinates = new ArrayList<>();
        for (int i = 0; i < N; i++) {
            coordinates.add(new Coordinate(in.nextInt(), in.nextInt()));
        }
        coordinates.sort(Coordinate::compareTo);
        for (Coordinate c : coordinates) {
            System.out.println(c.x + " " + c.y);
        }
        return ;
    }

    public static class Coordinate implements Comparable<Coordinate>{
        private int x;
        private int y;

        public Coordinate(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }


        @Override
        public int compareTo(Coordinate other) {
            if (this.x != other.x) {
                return this.x - other.x;
            } else {
                return this.y - other.y;
            }
        }
    }
}
