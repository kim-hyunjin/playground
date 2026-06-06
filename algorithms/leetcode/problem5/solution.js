/**
 * https://leetcode.com/problems/longest-palindromic-substring
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (s === null || s.length < 1) return '';

  let start = 0;
  let end = 0;

  for (let center = 0; center < s.length; center++) {
    const len = getPeleindromeLengthAroundCenter(s, center);
    if (len > end - start) {
      start = center - Math.floor((len - 1) / 2);
      end = center + Math.floor(len / 2);
    }
  }

  return s.substring(start, end + 1);
};

function getPeleindromeLengthAroundCenter(s, center) {
  const len1 = expandAroundCenter(s, center);
  const len2 = expandAroundTwoCenter(s, center, center + 1);
  return Math.max(len1, len2);
}

function expandAroundCenter(s, center) {
  return expandAroundTwoCenter(s, center, center);
}

function expandAroundTwoCenter(s, left, right) {
  let L = left;
  let R = right;
  while (L >= 0 && R < s.length && s.charAt(L) === s.charAt(R)) {
    L--;
    R++;
  }

  return R - L - 1;
}

module.exports = longestPalindrome;
