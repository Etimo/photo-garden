# photo-garden

[![Build Status](https://travis-ci.org/Etimo/photo-garden.svg?branch=master)](https://travis-ci.org/Etimo/photo-garden)

An easy way for anyone to get an overview of a large amount of photos from different vendors and sources.

# Getting started

To be able to run everything you need to have the following settings configurerd in your environment:

* PHOTO_GARDEN_PROVIDERS_GOOGLE_DRIVE_CLIENT_ID - The id of your client registered in Google API Console.
* PHOTO_GARDEN_PROVIDERS_GOOGLE_DRIVE_CLIENT_SECRET - The secret of your same client as above.

The application will refuse to start if the above parameters have not been set.

When you have all configuration set up you can run the following command to start a development environment:

```
docker-compose up --build
```

When the command is done you can open `http://localhost:3000` in your favorite browser.

## Providers

Providers are the sources where images can be imported from.

Currently we are working on support for:

* Google Drive
