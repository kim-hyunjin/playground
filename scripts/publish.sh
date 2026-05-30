#!/bin/bash
# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.."

# 에러 발생 시 즉시 중단
set -e

echo "🚀 Starting MkDocs publication process..."

# 1. 의존성 확인 (선택 사항)
# uv sync

# 2. 빌드 및 배포
# gh-deploy는 기본적으로 'gh-pages' 브랜치로 빌드 결과물을 푸시합니다.
echo "📦 Building and deploying to GitHub Pages..."
uv run mkdocs gh-deploy --force

echo "✅ Publication complete! Check your site at https://kim-hyunjin.github.io/playground/"
