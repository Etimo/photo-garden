const https = require("https");
const querystring = require("querystring");

function getFrom(token, host, path, request, content) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      getPostOptions(host, path, token, content),
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

const getPostOptions = (host, path, token, content) => {
  if (content) {
    return {
      host: host,
      path: path,
      port: 443,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "Dropbox-API-Arg": JSON.stringify(content)
      }
    };
  }
  // [{"key":"Dropbox-API-Arg","value":"{\"path\": \"/Homework/math/Prime_Numbers.txt\"}","enabled":true}]
  return {
    host: host,
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
      getFrom(token, "api.dropboxapi.com", "/2/files/search", {
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
      getFrom(token, "api.dropboxapi.com", "/2/users/get_account", {
        account_id: accountId
      })
    );
  },
  getThumbnail: (token, path) => {
    return success(
      getFrom(token, "content.dropboxapi.com", "/2/files/get_thumbnail_batch", {
        entries: [
          {
            path: path,
            format: "jpeg",
            size: "w480h320",
            mode: "bestfit"
          }
        ]
      })
    );
  },
  getFile: (token, path) => {
    return success(
      getFrom(
        token,
        "content.dropboxapi.com",
        "/2/files/get_thumbnail_batch",
        null,
        {
          path: path
        }
      )
    );
  }
};
