#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash docker awscli
set -euo pipefail

if [ -z "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    eval $(aws ecr get-login --no-include-email --region eu-west-1)
    for app in $(ls apps); do
      REMOTE_URL=${ECR_BASE}$app
      docker tag photo-garden-$app:latest $REMOTE_URL
      docker push $REMOTE_URL
    done
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
