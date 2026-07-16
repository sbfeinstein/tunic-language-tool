#!/usr/bin/env sh

# Abort on errors
set -e

# Build
rm -rf dist
npm run build

# Navigate to build output
cd dist

# Create .nojekyll to bypass Jekyll processing
touch .nojekyll

git init
git add -A
git commit -m 'Deploy'

# Deploy to gh-pages branch
git push -f git@github.com:sbfeinstein/tunic-language-tool.git main:gh-pages

cd ..
