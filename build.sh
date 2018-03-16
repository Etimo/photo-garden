#!/bin/bash
set +uex

pip install --user awscli
export PATH=${PATH}:${HOME}/.local/bin
eval $(aws ecr get-login --no-include-email --region eu-west-1)

docker pull ${SEARCH_API_REMOTE_IMAGE_URL}
docker pull ${PROVIDERS_API_REMOTE_IMAGE_URL}

cd ${TRAVIS_BUILD_DIR}/search-api
docker build --cache-from ${SEARCH_API_REMOTE_IMAGE_URL}:latest -t photo-garden-search-api . 
cd ${TRAVIS_BUILD_DIR}/providers
docker build --cache-from ${PROVIDERS_API_REMOTE_IMAGE_URL}:latest -t photo-garden-providers-api .
