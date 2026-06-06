import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import datastructure.quiz_1302 as quiz_1302

class Test1302(unittest.TestCase):

    def test1(self):
        books = ["table","chair","table","table","lamp","door","lamp","table","chair"]
        self.assertEqual(quiz_1302.solution(books), "table")

    def test2(self):
        books = ["top", "top", "top", "top", "kimtop"]
        self.assertEqual(quiz_1302.solution(books), "top")

    def test3(self):
        books = ["a","a","a","b","b","b"]
        self.assertEqual(quiz_1302.solution2(books), "a")

    def test4(self):
        books = ["icecream","peanuts","peanuts","chocolate","candy","chocolate","icecream","apple"]
        self.assertEqual(quiz_1302.solution2(books), "chocolate")


if __name__ == '__main__':
    unittest.main()