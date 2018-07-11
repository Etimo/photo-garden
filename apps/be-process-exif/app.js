#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const imagePath = require("image-path");
const fs = require("fs");
const exifDb = require("exif-db");
const ExifImage = require("exif").ExifImage;

const options = {
  channel: "user-photo--downloaded",
  durableName: "user-photo-exif",
  // sequence: "earliest",
  clientId: "user-photo-exif"
};
communication.subscribe(options, async msg => {
  const data = JSON.parse(msg.data);

  // Check if exif image exists
  if ("exif" in data.sizes) {
    const p = imagePath.getFullPathAndFile(
      data.user,
      data.provider,
      data.providerId + "exif",
      data.extension
    );
    // Check if file exists
    if (fs.existsSync(p)) {
      try {
        new ExifImage({ image: p }, function(error, exifData) {
          if (error) console.log("Error: " + error.message);
          else {
            let s = JSON.stringify(exifData).replace(/\\u0000/g, "");
            // console.log(s);
            exifDb.setExif(data.id, s);
          }
        });
      } catch (error) {
        console.log("Error: " + error.message);
      }
    }
  }
  communication.publish("user-photo--exifed", data);
});
