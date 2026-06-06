#include <vector>
using namespace std;

class Solution {
public:
  vector<vector<int>> floodFill(vector<vector<int>> &image, int sr, int sc,
                                int color) {

    int originColor = image[sr][sc];
    if (originColor == color) {
      return image;
    }

    floodFill(image, sr, sc, color, originColor);

    return image;
  }

  void floodFill(vector<vector<int>> &image, int sr, int sc, int color,
                 int originColor) {

    if (sr < 0 || sr >= image.size() || sc < 0 || sc >= image[0].size() ||
        image[sr][sc] != originColor) {
      return;
    }

    image[sr][sc] = color;

    vector<int> up = {sr - 1, sc};
    vector<int> bottom = {sr + 1, sc};
    vector<int> left = {sr, sc - 1};
    vector<int> right = {sr, sc + 1};
    vector<vector<int>> directions =
        vector<vector<int>>{up, bottom, left, right};

    for (auto direct : directions) {
      int newSr = direct[0];
      int newSc = direct[1];
      floodFill(image, newSr, newSc, color, originColor);
    }
  }
};

// chat gpt 정답
class Solution2 {

  vector<vector<int>> floodFill(vector<vector<int>> &image, int sr, int sc,
                                int newColor) {
    int originalColor = image[sr][sc];
    // 시작 픽셀의 색상이 이미 목표 색상과 같다면 더 이상 작업할 필요 없음
    if (originalColor == newColor) {
      return image;
    }

    // DFS 호출
    dfs(image, sr, sc, originalColor, newColor);

    return image;
  }

  void dfs(vector<vector<int>> &image, int x, int y, int originalColor,
           int newColor) {
    // 이미지 범위를 벗어나거나 색상이 다르면 종료
    if (x < 0 || x >= image.size() || y < 0 || y >= image[0].size() ||
        image[x][y] != originalColor) {
      return;
    }

    // 현재 픽셀의 색상을 변경
    image[x][y] = newColor;

    // 상하좌우로 DFS 수행
    dfs(image, x + 1, y, originalColor, newColor);
    dfs(image, x - 1, y, originalColor, newColor);
    dfs(image, x, y + 1, originalColor, newColor);
    dfs(image, x, y - 1, originalColor, newColor);
  }
};

// 다른 사람 솔루션
class Solution3 {
public:
  void dfs(vector<vector<int>> &image, int i, int j, int val, int newColor) {
    //  checking all error conditions and returning than checking valid cell
    //  before calling recursive function.
    if (i < 0 || i >= image.size() || j < 0 || j >= image[0].size() ||
        image[i][j] == newColor || image[i][j] != val) {
      return;
    }
    image[i][j] = newColor;
    dfs(image, i - 1, j, val, newColor);
    dfs(image, i + 1, j, val, newColor);
    dfs(image, i, j - 1, val, newColor);
    dfs(image, i, j + 1, val, newColor);
  }

  vector<vector<int>> floodFill(vector<vector<int>> &image, int sr, int sc,
                                int newColor) {
    int val = image[sr][sc];
    dfs(image, sr, sc, val, newColor);
    return image;
  }
};

int main() {
  vector<vector<int>> *input =
      new vector<vector<int>>{{1, 1, 1}, {1, 1, 0}, {1, 0, 1}};

  Solution s;

  auto output = s.floodFill(*input, 1, 1, 2);

  return 0;
}