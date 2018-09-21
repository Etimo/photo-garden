#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl kubernetes-helm helmfile awscli docker parallel-rust -j32
set -euo pipefail

source result/docker-env
export KUBECONFIG=$(pwd)/kubeconfig

echo Pushing Docker Images
eval $(aws ecr get-login --no-include-email --region eu-west-1)
parallel docker push "${DOCKER_IMAGE_PREFIX}{}:$DOCKER_TAG" ::: $(ls apps jobs)

echo Deploying Kube Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
# Disabled due to a race condition (tiller is down for a while after `helm init`)
# echo Deploying Helm
# kubectl apply -f result/kubernetes/serviceaccount.tiller.yml
# helm init --upgrade --service-account tiller
echo Deploying Other Dependencies
helmfile sync

echo Deploying Photo Garden
# for app in $(ls apps); do
#   ./kubectl set image deploy/$app $app=${ECR_BASE}$app:latest
# done
kubectl apply -f result/kubernetes/ -R
