#!/usr/bin/env bash
set -euo pipefail

NIX_OPTS="--arg useDocker true"

# nix build shows nice progress bars, but doesn't report the final derivation path
nix build --max-jobs 32 --no-link $NIX_OPTS "$@"
NIX_OUT=$(nix-build --no-out-link --readonly-mode $NIX_OPTS)
docker load -i $NIX_OUT/docker-base.tar.gz
for img in $NIX_OUT/*.docker.tar.gz; do
  docker load -i $img &
done

wait
