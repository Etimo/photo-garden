#!/bin/bash

function wait_for {
  SERVICE=$1
  PORT=$2

  while ! nc -z $SERVICE $PORT; do
    echo "Waiting for $SERVICE to become available..."
    sleep 2
  done
}

wait_for db 5432
wait_for queue 5672
yarn run start:dev
