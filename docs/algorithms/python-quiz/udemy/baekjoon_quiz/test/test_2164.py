import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import datastructure.quiz_2164 as quiz_2164

class Test2164(unittest.TestCase):

    def test1(self):
        self.assertEqual(quiz_2164.solution(6), 4)


if __name__ == '__main__':
    unittest.main()