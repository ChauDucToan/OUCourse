#!/usr/bin/env bash
set -euo pipefail

ALLOWED_TYPES="feat|fix|docs|refactor|test|chore"
PATTERN="^(${ALLOWED_TYPES})\([a-z0-9_-]+\): .+"

# Kiểm tra các commit chuẩn bị push (so với upstream)
UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [[ -z "$UPSTREAM" ]]; then
  # Không có upstream (branch mới) -> kiểm tra 20 commit gần nhất cho đỡ “nặng”
  RANGE="HEAD~20..HEAD"
else
  RANGE="${UPSTREAM}..HEAD"
fi

COMMITS="$(git log --pretty=format:%s $RANGE 2>/dev/null || true)"
if [[ -z "$COMMITS" ]]; then
  exit 0
fi

while IFS= read -r line; do
  if ! [[ "$line" =~ $PATTERN ]]; then
    echo "❌ Push blocked: có commit message sai format!"
    echo "👉 Commit sai: $line"
    echo "👉 Format: type(scope): message"
    exit 1
  fi
done <<< "$COMMITS"

exit 0
