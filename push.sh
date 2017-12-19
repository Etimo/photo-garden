if [ -z "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    pip install --user awscli
    export PATH=${PATH}:${HOME}/.local/bin
    eval $(aws ecr get-login --region eu-west-1)
    docker tag photo-garden-search-api:latest \
        255196862254.dkr.ecr.eu-west-1.amazonaws.com/etimo/photo-garden-search-api:latest
    docker push 255196862254.dkr.ecr.eu-west-1.amazonaws.com/etimo/photo-garden-search-api:latest
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
