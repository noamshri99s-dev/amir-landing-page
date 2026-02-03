#!/bin/bash
# העלאת הפרויקט ל-GitHub עם Personal Access Token
# שימוש: GITHUB_TOKEN=ghp_xxxx ./push-to-github.sh
# או: ./push-to-github.sh   (ואז יבקש סיסמה/אימות)

set -e
cd "$(dirname "$0")"

REPO_URL="https://github.com/noamshri99s-dev/amir-landing-page.git"
if [ -n "$GITHUB_TOKEN" ]; then
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/noamshri99s-dev/amir-landing-page.git"
fi

git push -u origin main
echo "ההעלאה הושלמה: $REPO_URL"
