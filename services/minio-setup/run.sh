#!/usr/bin/env sh
set -euo pipefail
mc config host add minio http://minio:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

if ! mc stat minio/photos 2>&1 > /dev/null; then
  mc mb minio/photos
else
  echo Bucket minio/photos already exists, keeping it
fi
mc policy download minio/photos
# mc mb policy
