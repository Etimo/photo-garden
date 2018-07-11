#!/usr/bin/env bash
set -euo pipefail
TMP_BASE=/tmp/photo-garden/web-frontend
cd "$(dirname "$(realpath "$0")")"
node ../parcel-bundler/bin/cli.js fake-symlinked-src-to-force-parcel-to-recompile/src/index.html --out-dir=$TMP_BASE/dist --cache-dir=$TMP_BASE/cache
