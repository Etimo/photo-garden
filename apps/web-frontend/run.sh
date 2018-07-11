#!/usr/bin/env sh
cd "$(dirname "$(realpath "$0")")"
node ../parcel-bundler/bin/cli.js fake-symlinked-src-to-force-parcel-to-recompile/src/index.html --out-dir=/tmp/photo-garden/web-frontend/dist
