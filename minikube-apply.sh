#!/usr/bin/env bash
set -euo pipefail
eval $(minikube docker-env --shell bash)
helmfile sync
./docker-build.sh --argstr dockerTag a
kubectl --context=minikube apply -f result/kubernetes/ --recursive
