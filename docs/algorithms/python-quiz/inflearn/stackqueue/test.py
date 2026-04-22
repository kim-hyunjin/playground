import unittest
from puppet_draw import solution as puppetDraw
from postfix import solution as postfix
from steal_pipe import solution as stealPipe
from save_princess import solution as savePrincess
from curriculum import solution as curriculum
from emergency_room import solution as emergencyRoom

class Test(unittest.TestCase):

    def test_puppet_draw(self):
        puppets = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 3],
            [0, 2, 5, 0, 1],
            [4, 2, 4, 4, 2],
            [3, 5, 1, 3, 1]
        ]
        moves = [1, 5, 3, 5, 1, 2, 1, 4]
        expect = 4
        actual = puppetDraw(puppets, moves)
        self.assertEqual(expect, actual)

    def test_postfix(self):
        given = "352+*9-"
        expect = 12
        actual = postfix(given)
        self.assertEqual(expect, actual)

    def test_steal_pipe(self):
        given = "()(((()())(())()))(())"
        expect = 17
        actual = stealPipe(given)
        self.assertEqual(expect, actual)

    def test_save_princess(self):
        princeCnt = 8
        outCall = 3
        expect = 7
        actual = savePrincess(princeCnt, outCall)
        self.assertEqual(expect, actual)

    def test_curriculum(self):
        essential = "CBA"
        plan = "CBDAGE"
        self.assertTrue(curriculum(essential, plan))

    def test_emergency_room(self):
        q = [60, 50, 70, 80, 90]
        M = 2
        expect = 3
        actual = emergencyRoom(q, M)
        self.assertEqual(expect, actual)

if __name__ == '__main__':
    unittest.main()