#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl helmfile awscli -j32
set -euo pipefail

./push.sh

mkdir ~/.kube
export KUBECONFIG=$(pwd)/kubeconfig

# Deploy dependencies
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
helmfile sync

# for app in $(ls apps); do
#   ./kubectl set image deploy/$app $app=${ECR_BASE}$app:latest
# done
kubectl apply -f result/kubernetes/ -R
