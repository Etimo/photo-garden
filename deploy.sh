#!/bin/bash
set +uex

if [ "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    mkdir ~/.kube
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    chmod +x kubectl

    sed -i "s|KUBE_CA_CERT|$KUBE_CA_CERT|g; s|KUBE_ENDPOINT|$KUBE_ENDPOINT|g; s|KUBE_ADMIN_CERT|$KUBE_ADMIN_CERT|g; s|KUBE_ADMIN_KEY|$KUBE_ADMIN_KEY|g; s|KUBE_USERNAME|$KUBE_USERNAME|g" kubeconfig
    for app in $(ls apps); do
      ./kubectl --kubeconfig=kubeconfig set image deploy/$app $app=${ECR_BASE}$app:latest
    done
    ./kubectl apply -f apps/gateway/kubernetes.yml
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
