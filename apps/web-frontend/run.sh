#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$(realpath "$0")")"
TMP_BASE=/tmp/photo-garden/web-frontend
mkdir -p $TMP_BASE

# Parcel will not recompile stuff in node_modules... unless it:
# 1) has a source field in package.json
# 2) is a symlink
# Please don't ask me to explain what they were thinking
FAKE_PKG=$TMP_BASE/fake-symlinked-pkg-to-force-parcel-to-recompile
ln -s $(pwd) $FAKE_PKG
ln -s $(pwd)/.. $TMP_BASE/node_modules

node ../parcel-bundler/bin/cli.js $FAKE_PKG/src/index.html --out-dir=$TMP_BASE/dist --cache-dir=$TMP_BASE/cache
