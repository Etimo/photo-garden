#!/bin/bash
set +uex

cd ${TRAVIS_BUILD_DIR}/search-api
docker build -t photo-garden-search-api . 
cd ${TRAVIS_BUILD_DIR}/providers
docker build -t photo-garden-providers-api .
