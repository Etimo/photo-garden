#!/bin/bash
set +uex

pip install --user awscli
export PATH=${PATH}:${HOME}/.local/bin
eval $(aws ecr get-login --no-include-email --region eu-west-1)

docker pull ${GATEWAY_REMOTE_IMAGE_URL}

cd ${TRAVIS_BUILD_DIR}/apis/gateway
docker build --cache-from ${GATEWAY_REMOTE_IMAGE_URL}:latest -t photo-garden-gateway-api . 
