#!/bin/sh

# Wait for database to come up
false
while test "$?" -eq 1; do
    yarn postgrator
done
