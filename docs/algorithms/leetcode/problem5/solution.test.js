const solution = require('./solution.js');

test('Given a string s, return the longest palindromic substring in s.', () => {
  const answer1 = solution('babad');
  expect(answer1 === 'aba' || answer1 === 'bab').toBeTruthy();
  expect(solution('cbbd')).toBe('bb');
  expect(solution('a')).toBe('a');
});
