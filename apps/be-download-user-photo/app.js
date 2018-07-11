#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const photoDb = require("photo-db");
const imageDownloader = require("image-downloader");
const imagePath = require("image-path");
const fetch = require("node-fetch");
const fs = require("fs");

const options = {
  channel: "user-photo--prepared",
  durableName: "user-photo-downloader",
  // sequence: "earliest",
  clientId: "user-photo-downloader"
};
communication.subscribe(options, async msg => {
  // {
  //   id,
  //   extension,
  //   headers, provider, user

  //
  //   urls: {
  //   large: data.photo.images.standard_resolution.url,
  //   small: data.photo.images.standard_resolution.url
  // }
  // }
  const data = JSON.parse(msg.data);

  // Create path to download to, if not already existing
  imagePath.assertPath(
    data.user,
    data.provider,
    data.providerId,
    data.extension
  );

  // Download thumbnail
  for (const key in data.sizes) {
    if (data.sizes.hasOwnProperty(key)) {
      const size = data.sizes[key];
      let options = {
        headers: size.headers,
        url: size.url,
        dest: imagePath.getFullPathAndFile(
          data.user,
          data.provider,
          data.providerId + key,
          data.extension
        )
      };
      const res = await fetch(size.url, {
        headers: size.headers
      });
      const dest = fs.createWriteStream(options.dest);
      res.body.pipe(dest);

      // await imageDownloader.image(options);
      logger.info(`Downloaded thumbnail image ${data.id} to ${options.dest}`);
    }
  }

  communication.publish("user-photo--downloaded", data);
});
