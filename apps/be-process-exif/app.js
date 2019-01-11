#!/usr/bin/env node
const communication = require("communication");
const config = require("config");
const logger = require("logging");
const imagePath = require("image-path");
const fs = require("fs");
const exifDb = require("exif-db");
const ExifImage = require("exif").ExifImage;
// TODO #42
// const color = require("photo-color");
const Minio = require("minio");
const minioClient = new Minio.Client({
  endPoint: config.get("s3.endpoint"),
  port: config.get("s3.port"),
  secure: config.get("s3.secure"),
  accessKey: config.get("s3.accessKey"),
  secretKey: config.get("s3.secretKey")
});
const s3Bucket = config.get("s3.bucket");

function readStreamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const bufs = [];
    stream.on("error", err => reject(err));
    stream.on("data", chunk => bufs.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(bufs)));
  });
}

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
    const p = imagePath.getPathAndFile(
      data.user,
      data.provider,
      data.providerId,
      data.extension,
      "exif"
    );
    const imageBuf = await minioClient
      .getObject(s3Bucket, p)
      .then(readStreamToBuffer)
      .catch(err => console.log(err));
    try {
      new ExifImage({ image: imageBuf }, function(error, exifData) {
        if (error) console.log("Error: " + error.message);
        else {
          let s = JSON.stringify(exifData).replace(/\\u0000/g, "");
          exifDb.setExif(data.id, s);
          processExif(data.id, exifData);
        }
      });
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }
  communication.publish("user-photo--exifed", data);
  if ("small" in data.sizes) {
    const p = imagePath.getPathAndFile(
      data.user,
      data.provider,
      data.providerId,
      data.extension,
      "small"
    );
    const imageBuf = await minioClient
      .getObject(s3Bucket, p)
      .then(readStreamToBuffer)
      .catch(err => console.log(err));
    try {
      // TODO: #42 Below row is related to color issue
      // const imageColor = color.getAverageFromBuffer(imageBuf);
      // exifDb.setColor(data.id, imageColor);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }
});

function processExif(photoId, exif) {
  if (exif.gps && exif.gps.GPSLatitude) {
    const lat = convertDMSToDD(
      exif.gps.GPSLatitude[0],
      exif.gps.GPSLatitude[1],
      exif.gps.GPSLatitude[2],
      exif.gps.GPSLatitudeRef
    );

    const long = convertDMSToDD(
      exif.gps.GPSLongitude[0],
      exif.gps.GPSLongitude[1],
      exif.gps.GPSLongitude[2],
      exif.gps.GPSLongitudeRef
    );
    exifDb.setLongLatFromExif(photoId, long, lat);
  }
}
function convertDMSToDD(degrees, minutes, seconds, direction) {
  // "GPSLatitudeRef": "N", "GPSLongitudeRef": "E"
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}
