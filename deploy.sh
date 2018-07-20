#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl helmfile awscli -j32
set -euo pipefail

./push.sh

mkdir -p ~/.kube
export KUBECONFIG=$(pwd)/kubeconfig

echo Deploying Kube Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
echo Deploying Dependencies
helmfile sync

echo Deploying Photo Garden
# for app in $(ls apps); do
#   ./kubectl set image deploy/$app $app=${ECR_BASE}$app:latest
# done
kubectl apply -f result/kubernetes/ -R
