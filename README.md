# photo-garden

[![Build Status](https://travis-ci.org/Etimo/photo-garden.svg?branch=master)](https://travis-ci.org/Etimo/photo-garden)

An easy way for anyone to get an overview of a large amount of photos from different vendors and sources.

# Yarn workspaces

The repo now uses yarn workspaces (https://yarnpkg.com/en/docs/workspaces) to handle shared dependencies. This, in my opinion, works well for a microservice architecture where all apps and libs should be self contained but with the benefit of sharing node_modules to prevent "module explosion".

How it works is that the root package.json defines an array of workspaces where every folder has their own package.json. When running yarn to install dependencies anywhere in the tree yarn will look at all package.json files, install all dependencies in a root node_modules folder to prevent duplicate copies, and then symlink needed modules between apps and libs. If a dependency is found in the repo it will be linked from the repo instead of installed from npm.

This also has the benefit of having one point where tools that affect the repo in general can be installed. These are installed as devDependencies in the root and doesn't affect any apps or libs. Things such as `pre-commit`, `prettier` etc are installed like this.

## How to install everything when checking out repo

From the root or inside apps or libs, run:

```
yarn
```

## How to add a new repo tool (such as prettier)

```
yarn add <name> -W
```

`-W` will tell yarn to install the dependency in the workspace root and not add it to anything but the root package.json.

## How to add a new dependency to an app or lib

In the folder of the app or lib, run:

```
yarn add <name>
```

This will install the dependency in the root node_modules and add the dependency to the app or lib package.json.

`<name>` can be an npm module or a module found in the libs or apps folder.

# Docker

Docker can now be used to run a full dev environment. Just run:

```
docker-compose up --build
```

This will setup all apps in their own container using a same base image defined in `common-service.yml`. This is to prevent differences between apps. This will also setup a database, initial schema and run all needed migrations (depending on the state of your db). Read more about db and migrations further down.

The following services will be exposed to your machine when docker compose is running:

* http://localhost:3000 - The gateway app
* http://localhost:3001 - The photo app frontend (web-frontend)
* http://localhost:15672 - Rabbitmq console GUI
* `localhost:5432` - Postgres db. Exposed on your machine to allow easy inspection.

# Linting and formatting

Prettier is now applied automatically to all commits to make code styling more common. Also removes the need to care about formatting your code. Formatting is applied to \*.{js,json,md,css} files when doing a `git commit`.

Will probably add automatic eslinting as well.

This is done using the npm module `pre-commit`. The module runs the commands specified in `package.json` `pre-commit` section.

# Libs

Libs are common dependencies that can be shared and used by all apps. They are implemented as npm modules to allow yarn to install them from other package.json files. No need to publish them to be able to install them in dev.

* config - [README](libs/config/README.md)
* logging - [README](libs/logging/README.md)
* communication - [README](libs/communication/README.md)
* db - [README](libs/db/README.md)

# Apps

These are the apps available right now. All apps have been refactored to share a same kind of structure. They have also been refactored to utilize all common libs.

To create a new app, just copy one of the existing ones and modify the package.json. Then run `yarn` in the folder or in the root.

To include the app in the docker setup you must also add a section in the `docker-compose.yml` file. Copy one of the other apps found there and tweak to your need.

## api-photos

The photos rest api like we had before but with queue handling broken out into another app.

## be-photo-import

A backend app that consume all new photos imported and inserts them into the database.

## gateway

The current gateway that serves all the frontend. Basically same as before even though a lot of refactoring has been done to utilize the new libs.

## web-frontend

Postcss config moved from package.json to `.postcssrc.json` for better compatibility. Couldn't get it to work otherwise.

# Services

These are services needed in docker that are not a lib nor an app.

## db

Postgres docker container with initial sql schema.

## db-migrations

Automatic migration handling for db using sql migration files. Just add a new migration file here using the specified format and recreate your docker container to have the migration applied.

# Todo

* Deployment not fixed yet
* Refactor unleash to an app
