#!/usr/bin/env sh

nix-build -j32
ls result/*.docker.tar.gz | xargs -L1 docker load -i
