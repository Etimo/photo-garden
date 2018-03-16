#!/bin/bash
set +uex

if [ "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    mkdir ~/.kube
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    chmod +x kubectl

    ./kubectl --kubeconfig=kubeconfig set image deployment/search-api search-api=${SEARCH_API_REMOTE_IMAGE_URL}:latest
    ./kubectl --kubeconfig=kubeconfig set image deployment/providers-api providers-api=${PROVIDERS_API_REMOTE_IMAGE_URL}:latest
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
