const https = require("https");
const querystring = require("querystring");

function getFrom(token, path, request, queryparams) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      getPostOptions(path, token, request, queryparams),
      res => {
        res.setEncoding("utf8");
        let data = "";
        res.on("data", d => {
          data += d;
        });
        res.on("end", () => {
          if (res.statusCode < 400) {
            const dataObject = JSON.parse(data);
            resolve(dataObject);
          }
          reject(`Dropbox returned with http: ${res.statusCode}`);
        });
      }
    );
    req.on('error"', e => {
      console.log("error", e);
      reject("Unexpected dropbox error");
    });

    if (request) {
      req.write(JSON.stringify(request));
    } else {
      req.write();
    }

    req.end();
  });
}
const getThumbnails = (token, photoIds) => {
  let entries = [];
  photoIds.forEach(id => {
    entries.push({
      path: id,
      format: "jpeg",
      size: "w2048h1536",
      mode: "bestfit"
    });
  });
  return success(
    getFrom(
      token,
      "2/files/get_thumbnail_batch",
      {},
      {
        data: {
          entries: entries
        }
      }
    )
  );
};
const getPostOptions = (path, token, request, queryparams) => {
  if (queryparams) {
    path += querystring.stringify(queryparams);
  }
  return {
    host: "api.dropboxapi.com",
    path: path,
    port: 443,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  };
};
const success = promise =>
  promise
    .then(data => ({
      success: true,
      data
    }))
    .catch(error =>
      Promise.resolve({
        success: false,
        error
      })
    );

module.exports = {
  getPhotos: (token, nextPageToken) => {
    return success(
      getFrom(token, "/2/files/search", {
        path: "",
        query: ".jpg",
        start: nextPageToken,
        max_results: 25, // max download batch
        mode: "filename"
      })
    );
  },
  getThumbnails: getThumbnails,
  getUserInfo: (token, accountId) => {
    return success(
      getFrom(token, "/2/users/get_account", {
        account_id: accountId
      })
    );
  }
};
