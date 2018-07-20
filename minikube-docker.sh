#!/usr/bin/env bash
set -euo pipefail
eval $(minikube docker-env --shell bash)
exec docker "$@"
