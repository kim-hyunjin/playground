import unittest
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

import datastructure.quiz_11286 as quiz_11286

class Test11286(unittest.TestCase):
    def setUp(self):
        self.hq = quiz_11286.AbsoluteHeap()

    def test1(self):
        self.hq.push(1)
        self.hq.push(-1)
        self.assertEqual(self.hq.pop(), -1)

    def test2(self):
        self.hq.push(-1)
        self.hq.push(-1)
        self.hq.push(2)
        self.assertEqual(self.hq.pop(), -1)

    def test3(self):
        self.hq.push(1)
        self.hq.pop()
        self.assertEqual(self.hq.pop(), 0)



if __name__ == '__main__':
    unittest.main()