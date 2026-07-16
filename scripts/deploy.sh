#!/usr/bin/env sh

# Abort on errors
set -e

# Build

echo "Removing old build output"
rm -rf dist

echo "Building"
npm run build

# Navigate to build output
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
