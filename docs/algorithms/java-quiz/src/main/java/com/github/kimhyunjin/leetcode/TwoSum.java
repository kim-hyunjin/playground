package com.github.kimhyunjin.leetcode;

import java.util.HashMap;
import java.util.Map;

/**
 * https://leetcode.com/problems/two-sum/
 */
public class TwoSum {
    /*
    * Brute Force
    * Time complexity: O(n^2)
    * Space complexity: O(1)
    * */
    public int[] solution1(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[j] == target - nums[i]) {
                    return new int[] { i, j };
                }
            }
        }
        return null;
    }

    /*
    * Intuition
    *
    * To improve our runtime complexity,
    * we need a more efficient way to check if the complement exists in the array.
    * If the complement exists, we need to get its index.
    * What is the best way to maintain a mapping of each element in the array to its index?
    * A hash table.
    *
    * We can reduce the lookup time from O(n) to O(1) by trading space for speed.
    * A hash table is well suited for this purpose
    * because it supports fast lookup in near constant time.
    * I say "near" because if a collision occurred, a lookup could degenerate to O(n) time.
    * However, lookup in a hash table should be amortized O(1) time as long as the hash function was chosen carefully.
    * */

    /*
    * Hash Table
    * Time complexity: O(n)
    * Space complexity: O(n)
    * */
    public int[] solution2(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return null;
    }
}
