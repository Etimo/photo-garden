#!/usr/bin/env nix-shell
#! nix-shell -i bash -p bash kubectl kubernetes-helm helmfile awscli docker parallel-rust -j32
set -euo pipefail

source result/docker-env
export KUBECONFIG=$(pwd)/kubeconfig

echo Pushing Docker Images
eval $(aws ecr get-login --no-include-email --region eu-west-1)
parallel -j20 docker push "${DOCKER_IMAGE_PREFIX}{}:$DOCKER_TAG" ::: $(ls apps jobs)

echo Deploying Kube Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
echo Deploying Helm
helm init --client-only
echo 'Not deploying tiller due to race conditions (run `helm init --upgrade --service-acount tiller` manually if required)'
# Disabled due to a race condition (tiller is down for a while after `helm init`)
# kubectl apply -f result/kubernetes/serviceaccount.tiller.yml
# helm init --upgrade --service-account tiller
echo Deploying Other Dependencies
helmfile sync

echo Deploying Photo Garden
kubectl delete jobs/db-migrations --ignore-not-found
kubectl apply --file result/kubernetes/ --recursive
