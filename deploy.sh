#!/bin/bash

# Build the site
echo "Building site..."
npm run build && touch out/.nojekyll

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d out

echo "Deployed successfully!"
