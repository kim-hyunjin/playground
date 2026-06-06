import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import greedy.quiz_1449 as quiz_1449

class Test1449(unittest.TestCase):

    def test1(self):
        tapeSize = 2
        leakedPosition = [1, 2, 100, 101]
        expect = 2
        actual = quiz_1449.solution(tapeSize, leakedPosition)
        self.assertEqual(actual, expect)

    def test2(self):
        tapeSize = 2
        leakedPosition = [1, 2, 3, 4]
        expect = 2
        actual = quiz_1449.solution(tapeSize, leakedPosition)
        self.assertEqual(actual, expect)

    def test3(self):
        tapeSize = 1
        leakedPosition = [3, 2, 1]
        expect = 3
        actual = quiz_1449.solution(tapeSize, leakedPosition)
        self.assertEqual(actual, expect)


if __name__ == '__main__':
    unittest.main()