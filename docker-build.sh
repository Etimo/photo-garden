#!/usr/bin/env nix-shell
#! nix-shell -i bash -p nix bash docker parallel-rust

set -euo pipefail

NIX_OPTS="--arg useDocker true"

# nix build shows nice progress bars, but doesn't report the final derivation path
nix build --max-jobs 32 --no-link $NIX_OPTS "$@"
NIX_OUT=$(nix-build --no-out-link --readonly-mode $NIX_OPTS)
docker load -i $NIX_OUT/docker-base.tar.gz
parallel docker load -i ::: $NIX_OUT/*.docker.tar.gz
cp $NIX_OUT/docker-compose.yml .
