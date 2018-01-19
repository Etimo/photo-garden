if [ "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    ./bin/ecs-deploy.sh -r eu-west-1 -c ${CLUSTER_NAME} -n ${SEARCH_API_SERVICE_NAME} -i ${SEARCH_API_REMOTE_IMAGE_URL}:latest
    ./bin/ecs-deploy.sh -r eu-west-1 -c ${CLUSTER_NAME} -n ${PROVIDERS_API_SERVICE_NAME} -i ${PROVIDERS_API_REMOTE_IMAGE_URL}:latest
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
