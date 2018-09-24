#!/usr/bin/env nix-shell
#! nix-shell -i bash -p nix bash docker parallel-rust -j30

set -euo pipefail

NIX_OPTS="--arg useDocker true $@"

echo "Building images"
# nix build shows nice progress bars, but doesn't report the final derivation path
if [ "${CI-}" != true ]; then
  nix build --max-jobs 30 --no-link $NIX_OPTS
fi
NIX_OUT=$(nix-build --max-jobs 30 $NIX_OPTS)

echo "Copying docker-compose.yml"
cp --no-preserve=mode $NIX_OUT/docker-compose.yml .

echo "Loading base image"
docker load -i $NIX_OUT/docker-base.tar.gz

echo "Loading images"
parallel -j20 docker load -i ::: $NIX_OUT/*.docker.tar.gz
