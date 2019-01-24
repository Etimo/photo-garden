#!/usr/bin/env nix-shell
#! nix-shell -i bash -p nix bash docker parallel-rust skopeo -j30
set -euo pipefail

NIX_OPTS="--file . --arg useDocker true $@"

echo "Building images"
nix build --max-jobs 30 --no-link dockerBuild.{skopeoLoadMap,composeFile} $NIX_OPTS
SKOPEO_LOAD_MAP=$(nix path-info dockerBuild.skopeoLoadMap $NIX_OPTS)
DOCKER_COMPOSE_FILE=$(nix path-info dockerBuild.composeFile $NIX_OPTS)

echo "Copying docker-compose.yml"
cp --no-preserve=mode $DOCKER_COMPOSE_FILE docker-compose.yml

echo "Loading images"
parallel -j20 skopeo copy :::: $SKOPEO_LOAD_MAP
