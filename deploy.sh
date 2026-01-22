#!/bin/bash

# Build the site
echo "Building site..."
npm run build

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d out

echo "Deployed successfully!"
