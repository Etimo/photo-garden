#!/bin/bash
set +uex

if [ -z "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    docker tag photo-garden-gateway-api:latest ${GATEWAY_API_REMOTE_IMAGE_URL}
    docker push ${GATEWAY_API_REMOTE_IMAGE_URL}
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
