#!/bin/bash
set +uex

pip install --user awscli
export PATH=${PATH}:${HOME}/.local/bin
eval $(aws ecr get-login --no-include-email --region eu-west-1)

for app in $(ls apps); do
  echo "Found app: $app"
  REMOTE_URL=${ECR_BASE}$app
  echo "Remote url: $REMOTE_URL"
  echo "Run cmd: docker pull $REMOTE_URL"
  docker pull $REMOTE_URL

  # cd ${TRAVIS_BUILD_DIR}/apps/$app
  echo "Run cmd: docker build --cache-from $REMOTE_URL:latest -t photo-garden-$app -f Dockerfile.service.development --build-arg APP_NAME $app ."
  docker build --cache-from $REMOTE_URL:latest -t photo-garden-$app -f Dockerfile.service.development --build-arg APP_NAME $app .
done
