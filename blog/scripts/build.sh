#!/bin/bash
# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.."

echo "🏗️ Building MkDocs site with uv..."
uv run mkdocs build
