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

# Nix!

The Docker images are now built using Nix.

## Install

The exact procedure depends on what OS you use, since the Docker images need to be built for a Linux target.

### Linux

You're in luck! Just install Nix following the instructions at https://nixos.org/nix/. The short version:
run

```bash
curl https://nixos.org/nix/install | sh
```

You also need to install Docker, but the exact procedure for that depends on your distro.

### macOS

1.  Install Docker for Mac: https://www.docker.com/docker-machttps://www.docker.com/docker-mac
2.  Install Nix: `curl https://nixos.org/nix/install | sh` (just like on Linux)
3.  Set up a [https://nixos.wiki/wiki/Distributed_build](remote Linux builder), which is easiest done using
    [https://github.com/LnL7/nix-docker#running-as-a-remote-builder](nix-docker).

### Windows 10

Nix doesn't run natively on Windows, but runs fine (aside from Microsoft/WSL#2395) under the WSL. Note that
Docker for Windows only runs on Windows 10 Pro and Enterprise.

![stack diagram](docs/Photo%20Garden%20stack%20on%20Windows.svg)

1.  Install WSL
    1.  Go to Control Panel\Programs\Programs and Features
    2.  Click "Turn Windows features on or off"
    3.  Enable "Windows Subsystem for Linux"
2.  Install your favorite WSL distro (I've only tested this using Ubuntu). For instance, install Ubuntu from Microsoft Store: https://www.microsoft.com/store/productId/9NBLGGH4MSV6
3.  Install Docker Toolbox (if using Windows 10 Home) or Docker for Windows (if using Windows 10 Pro or Enterprise)
4.  Install Nix by running this in WSL:

```bash
sudo mkdir -p /etc/nix
sudo echo "use-sqlite-wal = false" >> /etc/nix/nix.conf
curl https://nixos.org/nix/install | sh
```

5.  Enable remote Docker access (if using Docker for Windows)
    See: https://medium.com/@sebagomez/installing-the-docker-client-on-ubuntus-windows-subsystem-for-linux-612b392a44c4
6.  Set DOCKER_HOST inside WSL to point to your Docker instance (localhost:2375 when using Docker for Windows)

## Building

Run `./docker-build.sh` to build and `docker load` the images, and then run `docker-compopse up --detach db && docker-compose up` to start everything.

## Caching

All our CI builds are cached, which you can use to dramatically speed up your first-time build times. To enable the cache,
download [Cachix](https://cachix.org/) and then run `cachix use photogarden`.

## Adding new dependencies

Remote dependencies (from NPM) are automatically picked up from `yarn.lock`, and just require a rebuild.
However, intra-workspace dependencies need to be specified in `workspace.nix`, in the `workspaceDependencies` field.

## Adding new projects

Projects in the Yarn workspace (`libs/*` and `apps/*`) are automatically picked up by the Nix build system. A Docker
image is built for each subfolder in the `apps` folder.

## Garbage collection

By default Nix will store _everything_ you have ever built, as well as all dependencies. As you can imagine, this will
grow pretty quickly. To get rid of everything that isn't currently required, you can run `nix-collect-garbage -d`, which
runs a mark-and-sweep garbage collection on the Nix store.

You can also run `nix optimise-store`, which will replace identical files with hardlinks. This is a bit slower than
`nix-collect-garbage` and usually not quite as effective, but it leaves you with a still-populated cache, keeping the next
build fast.

Keep in mind that on Mac you'll want to GC both your host Nix and your build slave regularly!

## Troubleshooting

### Nix can't find `/long/path/to/package.json`

Typical error message:

```
error: opening file '/home/teo/Documents/photo-garden/apps/blah/package.json': No such file or directory
```

This happens when there are folders inside apps or libs that aren't packages, usually because the package was renamed or
removed. To fix this, run `git clean -idx apps/blah` (in this example) to remove the remaining node_modules, and then
rebuild.

### Nix can't find package attribute

Typical error message:

```
error: attribute 'db-migrations' missing, at /path/to/docker.nix
```

This happens when the Yarn package has a different name than its folder. Open its `package.json` file, and verify that
the the `name` attribute matches the name of the directory it is located in.

### Rebuilding gets stuck for a while at `Rebuilding fresh packages`, and the produced Docker images are massive

This happens because native libraries (such as `node-sass`) are prevented by the Nix sandbox from accessing the internet
and downloading the prebuilt binaries, forcing a local rebuild instead. The Docker images are large because the Node build
tools refer to the compiler location, making Nix think that this is a legitimate dependency (which should be included in the
final image.

As a workaround you can disable the Nix sandbox. If you use NixOS then add `nix.useSandbox = false;` to
`/etc/nixos/configuration.nix` and rebuild (`sudo nixos-rebuild switch`). Otherwise, add `sandbox = false` to `/etc/nix/nix.conf`.

# Docker

Docker can be used to run a full dev environment. Just run (after following the setup procedure in the previous section):

```
./docker-build.sh # Only if there are new dependencies since the last rebuild
docker-compose up --detach db
docker-compose up
```

The following services will be exposed to your machine when docker compose is running:

- http://localhost:3000 - The gateway app
- http://localhost:3001 - The photo app frontend (web-frontend)
- `localhost:4222` - Nats streaming server
- `localhost:8222` - Nats streaming server monitoring
- `localhost:9000` - Minio file storage server (Amazon S3 clone)
  - Access key: `not-so-access`
  - Secret key: `not-so-secret`
- `localhost:5433` - Postgres db. Exposed on your machine to allow easy inspection.
  - Connect by running `psql --host=localhost --port=5433 --user=postgres`

## Reset db and queue

If you want to reset the db (to run new migrations) and queue (to clear saved state) you can run:

```
docker-compose down
```

# Linting and formatting

Prettier is now applied automatically to all commits to make code styling more common. Also removes the need to care about formatting your code. Formatting is applied to \*.{js,json,md,css} files when doing a `git commit`.

Will probably add automatic eslinting as well.

This is done using the npm module `pre-commit`. The module runs the commands specified in `package.json` `pre-commit` section.

# Libs

Libs are common dependencies that can be shared and used by all apps. They are implemented as npm modules to allow yarn to install them from other package.json files. No need to publish them to be able to install them in dev.

- app-name - [README](libs/app-name/README.md)
- config - [README](libs/config/README.md)
- logging - [README](libs/logging/README.md)
- communication - [README](libs/communication/README.md)
- db - [README](libs/db/README.md)
- dropbox-api - [README](libs/dropbox-api/README.md)

# Apps

These are the apps available right now. All apps have been refactored to share a same kind of structure. They have also been refactored to utilize all common libs.

To create a new app, just copy one of the existing ones and modify the package.json. Then run `yarn` in the folder or in the root.

To include the app in the docker setup you must also add a section in the `docker-compose.yml` file. Copy one of the other apps found there and tweak to your need.

## api-photos

The photos rest api like we had before but with queue handling broken out into another app.

## be-download-user-photo-dropbox

A backend app that downloads all images imported from Dropbox.
For now it also normalize the photos.

## be-download-user-photo-google-drive

A backend app that downloads all images imported from Google Drive.

## be-normalize-user-photo-google-drive

A backend app that normalizes all images from Google Drive before importing them to the db.

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

# Current queues

These are the current queues available:

## user-photo--google-drive--received

All images imported from Google Drive are published to this queue with the following format:

```
{
  "user": string,
  "photo": GoogleDrivePhotoResource
}
```

[GoogleDrivePhotoResource](https://developers.google.com/drive/v3/reference/files#resource)

## user-photo--downloaded

All photos that have been downloaded are published to this queue to indicate that further handling of the file is now possible.

Message format:

```
{
  "id": string,
  "extension": string
}
```

## user-photo--normalized

All photos that have been normalized will be published to this queue.

Message format:

```
{
  "owner": string,  // user guid
  "url": string,  // Url to thumbnail/base64 thumbnail
  "mimeType": string,
  "provider": string,  // E.g. "Google" for google drive
  "providerId": string,
  "original": Object
}
```

`original` is the same structure as the raw item from the provider, e.g. GoogleDrivePhotoResource if imported from Google Drive.

# Todo

- Deployment not fixed yet
- Refactor unleash to an app
