# photo-garden
[![Build Status](https://travis-ci.org/Etimo/photo-garden.svg?branch=master)](https://travis-ci.org/Etimo/photo-garden)

An easy way for anyone to get an overview of a large amount of photos from different vendors and sources.

# Getting started
To be able to run everything you need to have the following settings configurerd in your environment:

The providers service requires the following:
* GOOGLE_CLIENT_ID - The id of your client registered in Google API Console.
* GOOGLE_CLIENT_SECRET - The secret of your same client as above.
* GOOGLE_CLIENT_REDIRECT_URI - The URI where the auth callback is hosted. Will default to `http://localhost:8080/providers/google-drive/auth/start` if not specified which works if running with default options on localhost.

The application will refuse to start if the above parameters have not been set.

When you have all configuration set up you can run the following command to start a development environment:

```
./dev.sh
```


## Providers
Providers are the sources where images can be imported from.

Currently we are working on support for:
* Google Drive
