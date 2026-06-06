#!/bin/bash
# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.."

echo "🚀 Starting MkDocs serve with uv at http://127.0.0.1:8000"
uv run mkdocs serve
