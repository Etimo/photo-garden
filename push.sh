#!/bin/bash
set +uex

if [ -z "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
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
