#!/bin/sh
yarn add postgrator-cli
# Wait for database to come up
false
while test "$?" -eq 1; do
    ./node_modules/.bin/postgrator
done
