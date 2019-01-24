#!/usr/bin/env nix-shell
#! nix-shell -i bash -A managementEnv -j32
set -euo pipefail

NIX_OPTS="--file . --arg useDocker true $@"
export KUBECONFIG=$(pwd)/kubeconfig

echo Building Docker Images
nix build --max-jobs 30 --no-link dockerBuild.{skopeoUploadMap,kubernetesConfig} $NIX_OPTS
SKOPEO_UPLOAD_MAP=$(nix path-info dockerBuild.skopeoUploadMap $NIX_OPTS)
KUBERNETES_CONFIG=$(nix path-info dockerBuild.kubernetesConfig $NIX_OPTS)

echo Pushing Docker Images
eval $(aws ecr get-login --no-include-email --region eu-west-1)
parallel -j20 skopeo copy :::: $SKOPEO_UPLOAD_MAP

echo Deploying Kube Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml
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
kubectl apply --filename=$KUBERNETES_CONFIG --recursive
