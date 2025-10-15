#!/bin/bash

# Build script for MishraShardendu22 Personal Website
# This script is used by Vercel to build the Next.js application in a Turborepo monorepo

set -e

echo "🚀 Starting build for Personal Website..."

# Navigate to monorepo root
cd ../..

# Build using Turborepo - filter for this specific app
echo "📦 Building with Turborepo..."
pnpm turbo run build --filter=ms22-main

echo "✅ Build completed successfully!"
