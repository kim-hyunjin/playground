import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import greedy.quiz_11047 as quiz_11047

class Test11047(unittest.TestCase):
    
    def test1(self):
        coins = [1,5,10,50,100,500,1000,5000,10000,50000]
        target = 4200
        expect = 6
        actual = quiz_11047.solution(coins, target)
        self.assertEqual(expect, actual)
    
    def test2(self):
        coins = [1,5,10,50,100,500,1000,5000,10000,50000]
        target = 4790
        expect = 12
        actual = quiz_11047.solution(coins, target)
        self.assertEqual(expect, actual)


if __name__ == '__main__':
    unittest.main()