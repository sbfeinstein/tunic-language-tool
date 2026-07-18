#!/usr/bin/env sh
# Typically this project is deployed automatically via GitHub Actions upon commits to main
# This script provides an alternative in case it is necessary to force a deploy directly to the gh-pages branch.

# Abort on errors
set -e

# Build

echo "Building"
APP_BASE_URL="https://sbfeinstein.github.iou" npm run build
cd dist

# Create .nojekyll to bypass Jekyll processing
touch .nojekyll

echo "Initializing git"
git init
git add -A
git commit -m 'Deploy'

# Deploy to gh-pages branch
echo "Deploying via git push"
git push -f git@github.com:sbfeinstein/tunic-language-tool.git main:gh-pages
cd ..
