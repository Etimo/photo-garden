#!/usr/bin/env bash
set -euo pipefail

NIX_OUT=$(nix-build -j32 --no-out-link --arg useDocker true)
for img in $NIX_OUT/*.docker.tar.gz; do
  docker load -i $img &
done

wait
