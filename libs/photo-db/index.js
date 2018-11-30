const logger = require("logging");
const dbClient = require("db").create("garden");

async function insert(image) {
  logger.info(`Longitude of image: ${image.longitude}`);
  const response = await dbClient.query(
    "INSERT INTO photos(owner, extension, mime_type, provider, provider_id, original,longitude,latitude) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT ON CONSTRAINT provider_id_unique DO UPDATE SET provider_id=$5 RETURNING id",
    [
      image.owner,
      image.extension,
      image.mimeType,
      image.provider,
      image.providerId,
      image.original,
      image.longitude,
      image.latitude
      //image.longitude ? image.longitude : getRandomInRange(17.509316333, 18.2509316333, 8), //18.0509316333;,
      //image.latitude ? image.latitude : getRandomInRange(59.3210922667, 59.5210922667, 8) //59.3210922667;
    ]
  );
  return response.rows[0].id;
}

// async function storeColors(photoId, image) {
//   // logger.info(image.color, "color", photoId);
//   if (image.color) {
//     var response = await dbClient.query(
//       "insert into photo_color(photo_id, r, g, b, a) values($1, $2, $3, $4, $5)",
//       [photoId, image.color.r, image.color.g, image.color.b, image.color.a]
//     );
//     return response.rows[0] !== undefined ? response.rows[0].id : undefined;
//   }
//   return null;
// }

// async function addImage(msg) {
//   try {
//     const image = JSON.parse(msg.data);
//     const id = await insert(image);
//     // await channel.ack(msg);
//     if (id !== undefined) {
//       const colorId = await storeColors(id, image);
//       // logger.info(`Imported image for user ${image.owner} as ${id}`);
//     }
//     communication.publish("user-photo--imported", {id, providerId: image.providerId, owner: image.owner})
//   } catch (err) {
//     // await channel.nack(msg);
//     logger.error(`Failed to import image: ${err}, returning to the queue...`);
//   }
// }

// const options = {
//   channel: "user-photo--normalized",
//   durableName: "user-photo--persister",
//   clientId: "user-photo--persister"
// };
// communication.subscribe(options, addImage);

module.exports = {
  insert
};
