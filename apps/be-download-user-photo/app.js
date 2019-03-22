#!/usr/bin/env node
const communication = require("communication");
const config = require("config");
const logger = require("logging");
const photoDb = require("photo-db");
const imagePath = require("image-path");
const fetch = require("node-fetch");
const fs = require("fs");

const Minio = require("minio");
const minioClient = new Minio.Client({
  endPoint: config.get("s3.endpoint"),
  port: config.get("s3.port"),
  secure: config.get("s3.secure"),
  accessKey: config.get("s3.accessKey"),
  secretKey: config.get("s3.secretKey")
});
const s3Bucket = config.get("s3.bucket");
const s3Region = config.get("s3.region");

const options = {
  channel: "user-photo--prepared",
  durableName: "user-photo-downloader",
  // sequence: "earliest",
  clientId: "user-photo-downloader",
  ackTimeoutMillis: 5 * 1000
};
communication.subscribe(options, async msg => {
  const data = JSON.parse(msg.data);
  // Download thumbnail
  for (const key in data.sizes) {
    if (data.sizes.hasOwnProperty(key)) {
      const size = data.sizes[key];
      const res = await fetch(size.url, {
        headers: size.headers
      });
      const dest = imagePath.getPathAndFile(
        data.user,
        data.provider,
        data.providerId,
        data.extension,
        key
      );
      if (res.ok) {
        try {
          const putOperation = await minioClient.putObject(
            s3Bucket,
            dest,
            res.body,
            undefined,
            {
              "Content-Type": res.headers.get("content-type")
            }
          );
        } catch (error) {
          logger.error("fel");
        }
      }

      logger.info(`Downloaded ${key} image ${data.id} to ${dest}`);
    }
  }

  communication.publish("user-photo--downloaded", data);
});
