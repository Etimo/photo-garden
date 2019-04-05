#!/usr/bin/env nix-shell
#! nix-shell -i bash -A managementEnv -j32
set -euo pipefail

NIX_OPTS="--file . --arg useDocker true $@"
export KUBECONFIG=$(pwd)/deploy/kubeconfig

echo Building Docker Images
nix build --max-jobs 30 --no-link dockerBuild.{skopeoUploadMap,kubernetesConfig} $NIX_OPTS
SKOPEO_UPLOAD_MAP=$(nix path-info dockerBuild.skopeoUploadMap $NIX_OPTS)
KUBERNETES_CONFIG=$(nix path-info dockerBuild.kubernetesConfig $NIX_OPTS)

echo Pushing Docker Images
if [[ -t 0 ]]; then
  echo '(Is TTY, turning on progress display)'
  tty_arg='--bar'
else
  tty_arg=''
fi
parallel -j3 $tty_arg --colsep=' ' skopeo copy --dest-cert-dir=deploy/registry-keys :::: $SKOPEO_UPLOAD_MAP

echo Deploying Photo Garden
kubectl delete jobs/db-migrations --ignore-not-found
kubectl apply --filename=$KUBERNETES_CONFIG --recursive
