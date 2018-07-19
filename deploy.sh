#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl awscli -j32
set -euo pipefail

if [ "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    ./push.sh

    mkdir ~/.kube

    sed -i "s|KUBE_CA_CERT|$KUBE_CA_CERT|g; s|KUBE_ENDPOINT|$KUBE_ENDPOINT|g; s|KUBE_ADMIN_CERT|$KUBE_ADMIN_CERT|g; s|KUBE_ADMIN_KEY|$KUBE_ADMIN_KEY|g; s|KUBE_USERNAME|$KUBE_USERNAME|g" kubeconfig
    # for app in $(ls apps); do
    #   ./kubectl --kubeconfig=kubeconfig set image deploy/$app $app=${ECR_BASE}$app:latest
    # done
    for file in result/kubernetes/*.yml; do
      kubectl --kubeconfig=kubeconfig apply -f ./$file
    done
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
