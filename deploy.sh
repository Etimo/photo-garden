if [ "${TRAVIS_PULL_REQUEST}" ] || [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  if [ "${TRAVIS_BRANCH}" == "master" ]; then
    ./bin/ecs-deploy.sh -c ${TASK_DEFINITION} -n ${SERVICE} -i ${REMOTE_IMAGE_URL}:latest
  else
    echo "Not master, not deploying"
  fi
else
  echo "Pull request, not deploying"
fi
