# Providers service

## Config
To be able to run the app you need to have the following settings configurerd in your environment:

* GOOGLE_CLIENT_ID - The id of your client registered in Google API Console.
* GOOGLE_CLIENT_SECRET - The secret of your same client as above.
* GOOGLE_CLIENT_REDIRECT_URI - The URI where the auth callback is hosted. Will default to `http://localhost:3000/google-drive/auth/start` if not specified which works if running with default options on localhost.

The application will refuse to start if the above parameters have not been set.

## Running
From the providers folder, run the following command:

```
node app.js
```

This will start the providers service running on `localhost:3000`.

Try it by visiting http://localhost:3000/google-drive/auth/start to begin the authorization process. Once you have authorized the app it will currently output your photo files in the server console.
