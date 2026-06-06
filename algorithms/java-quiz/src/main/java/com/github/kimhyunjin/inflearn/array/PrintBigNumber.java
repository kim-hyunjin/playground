package com.github.kimhyunjin.inflearn.array;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class PrintBigNumber {
    public List<Integer> solution(int num, int[] numbers) {
        List<Integer> result = new ArrayList<>();
        result.add(numbers[0]);
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > numbers[i - 1]) {
                result.add(numbers[i]);
            }
        }
        return result;
    }
    public static void main(String[] args){
        PrintBigNumber printBigNumber = new PrintBigNumber();
        Scanner in=new Scanner(System.in);
        int input1 = Integer.parseInt(in.nextLine());

        int[] numbers = new int[input1];
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = in.nextInt();
        }

        List<Integer> results = printBigNumber.solution(input1, numbers);

        for (int i = 0; i < results.size(); i++) {
            if (i == results.size() - 1) {
                System.out.print(results.get(i));
            } else {
                System.out.print(results.get(i) + " ");
            }
        }
        return ;
    }
}
