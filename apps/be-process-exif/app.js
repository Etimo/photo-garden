#!/usr/bin/env node
const communication = require("communication");
const config = require("config");
const logger = require("logging");
const imagePath = require("image-path");
const fs = require("fs");
const exifDb = require("exif-db");
const ExifImage = require("exif").ExifImage;

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
      data.providerId + "exif",
      data.extension
    );
    const imageBuf = await minioClient
      .getObject(s3Bucket, p)
      .then(readStreamToBuffer);
    try {
      new ExifImage({ image: imageBuf }, function(error, exifData) {
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
  communication.publish("user-photo--exifed", data);
});
