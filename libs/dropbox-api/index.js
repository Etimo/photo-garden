const https = require("https");
const querystring = require("querystring");

function getFrom(token, path, request, content) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      getPostOptions(path, token, request, content),
      res => {
        res.setEncoding("utf8");
        let data = "";
        res.on("data", d => {
          data += d;
        });
        res.on("end", () => {
          let dataObject;
          if (res.statusCode < 400) {
            dataObject = JSON.parse(data);
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

const getPostOptions = (path, token, request, content) => {
  if (content) {
    return {
      host: "content.dropboxapi.com",
      path: path,
      port: 443,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    };
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

  getUserInfo: (token, accountId) => {
    return success(
      getFrom(token, "/2/users/get_account", {
        account_id: accountId
      })
    );
  },
  getThumbnail: (token, path) => {
    return success(
      getFrom(
        token,
        "/2/files/get_thumbnail_batch",
        {
          entries: [
            {
              path: path,
              format: "jpeg",
              size: "w480h320",
              mode: "bestfit"
            }
          ]
        },
        true
      )
    );
  },
  getFile: (token, path) => {
    return success(
      getFrom(
        token,
        "/2/files/get_thumbnail_batch",
        {
          entries: [
            {
              path: path,
              format: "jpeg",
              size: "w2048h1536",
              mode: "bestfit"
            }
          ]
        },
        true
      )
    );
  }
};
