import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import bruteforce.quiz_2309 as quiz_2309

class Test2309(unittest.TestCase):

    def test1(self):
        dwarfs = [20, 7, 23, 19, 10, 15, 25, 8, 13]
        self.assertEqual(quiz_2309.solution(dwarfs), [7, 8, 10, 13, 19, 20, 23])


if __name__ == '__main__':
    unittest.main()