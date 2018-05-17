const logger = require("logging");
const communication = require("communication");
const https = require('https');

// function filesListCallback(client, err, response, user) {
//   logger.info("Get files from drive using v3", err);
//   if (err) {
//     logger.error(`The API returned an error: ${err}`);
//     return;
//   }

//   // TODO: save nextPageToken so we dont have to start all over on next login
//   providerTokens.updateNextPageToken(user, response.nextPageToken);

//   if (response.hasOwnProperty("nextPageToken")) {
//     // We have not reached the end yet, continue listing
//     fetchPhotos(client, user, response.nextPageToken);
//   }
//   response.files
//     .filter(util.isValidFile)
//     .splice(0, 1)
//     .forEach(file => publishToQueue(file, user));
// }

// function publishToQueue(item, user) {
//   const normalized = util.normalizePhotoInfo(item, user);
//   communication.publish("user-photo--google-drive--received", {
//     user: user,
//     photo: item
//   });
// }

function fetchPhotos(token, user, nextPageToken) {
  logger.info('starting fetch');
  const request = {
    path: '',
    query: '.jpg',
    start: nextPageToken,
    max_results: 400,
    mode: "filename"
  }
  dropbox(token, user, '/2/files/search', request).then(photoList => {
    photoList.matches.forEach(match => {
      logger.info(match.metadata.name);
    });
    //.matches.metadatana.name
  }).catch(error => logger.warn(error));
  // const service = google.drive("v3");
  // service.files.list(request, (err, response) => {
  //   filesListCallback(client, err, response, user);
  // });
}


function dropbox(token, account_id, path, request) {
  let options = {
    host: 'api.dropboxapi.com',
    path: path,
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        const dataObject = JSON.parse(data);

        if (res.statusCode < 400) { resolve(dataObject) }
        reject(dataObject);

      });
    });
    req.on('error"', (e) => {
      reject('Unexpected dropbox error');
    });
    req.write(JSON.stringify(request));
    req.end();
  });


}

module.exports = {
  fetchPhotos
};
