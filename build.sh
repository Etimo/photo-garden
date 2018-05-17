#!/bin/bash
set +uex

pip install --user awscli
export PATH=${PATH}:${HOME}/.local/bin
eval $(aws ecr get-login --no-include-email --region eu-west-1)

for app in $(ls apps); do
  REMOTE_URL=${ECR_BASE}$app
  docker pull $REMOTE_URL

  # cd ${TRAVIS_BUILD_DIR}/apps/$app
  docker build --cache-from $REMOTE_URL:latest -t photo-garden-$app -f Dockerfile.service.development --build-arg APP_NAME=$app .
done
