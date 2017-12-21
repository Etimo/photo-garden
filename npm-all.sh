#!/bin/bash

GREEN='\033[0;32m'
WHITE='\033[0;32m'
NC='\033[0m'
for subrepo in $(find . -name package.json | grep -v node_modules); do
  subrepo_path=$(dirname $subrepo)
  echo -e "${GREEN}Running npm command in${NC} $subrepo_path..."
  (cd $subrepo_path && npm $@)
done

