#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash docker awscli -j32
set -euo pipefail

eval $(aws ecr get-login --no-include-email --region eu-west-1)
for app in $(ls apps); do
  echo ${ECR_BASE}$app:$DOCKER_TAG
  docker push ${ECR_BASE}$app:$DOCKER_TAG
done
