#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl helm helmfile awscli docker parallel-rust -j32
set -euo pipefail

mkdir -p ~/.kube
export KUBECONFIG=$(pwd)/kubeconfig

echo Pushing Docker Images
eval $(aws ecr get-login --no-include-email --region eu-west-1)
parallel docker push "${ECR_BASE}{}:$DOCKER_TAG" ::: $(ls apps)

echo Deploying Kube Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
echo Deploying Helm
helm init --upgrade --service-account tiller
echo Deploying Other Dependencies
helmfile sync

echo Deploying Photo Garden
# for app in $(ls apps); do
#   ./kubectl set image deploy/$app $app=${ECR_BASE}$app:latest
# done
kubectl apply -f result/kubernetes/ -R
