#!/usr/bin/env sh
cd "$(dirname "$(realpath "$0")")"
../.bin/parcel src/index.html --out-dir=/tmp/photo-garden/web-frontend/dist
