const config = require("config");
const logger = require("logging");

const dbClient = require("db").create("garden");

async function getDropboxTokenByUserId(user_id) {
  const response = await dbClient.query(
    "SELECT token FROM dropbox_tokens WHERE user_id = $1 ",
    [user_id]
  );
  return response.rows[0].token || undefined;
}
async function getDropboxPhotoIDByPhotoId(photo_id) {
  const response = await dbClient.query(
    "select provider_id from photos where id = $1 ",
    [photo_id]
  );
  return response.rows[0].provider_id || undefined;
}
async function storeDropboxToken(user_id, token) {
  const response = await dbClient.query(
    "SELECT token FROM dropbox_tokens WHERE user_id = $1 ",
    [user_id]
  );
  const db = await dbClient.connect();
  try {
    db.query("BEGIN");
    if (response.rows[0] !== undefined) {
      const userResponse = await dbClient.query(
        "UPDATE dropbox_tokens SET token = $1 WHERE user_id = $2",
        [token, user_id]
      );
    } else {
      logger.info("Inserting token");
      const userResponse = await dbClient.query(
        "INSERT INTO dropbox_tokens(user_id, token, next_page_token) VALUES($1, $2, 0)",
        [user_id, token]
      );
    }
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  } finally {
    db.release();
  }
}
async function getDropboxNextPageTokenByUserId(user_id) {
  const response = await dbClient.query(
    "SELECT * FROM dropbox_tokens WHERE user_id=$1",
    [user_id]
  );
  if (response.rows[0]) {
    return response.rows[0].next_page_token;
  } else {
    logger.info("could not get next page token", user_id);
    logger.info("could not get next page token", response.rows[0]);
    return null;
  }
}
async function setDropboxNextPageToken(user_id, token) {
  const response = await dbClient.query(
    "UPDATE dropbox_tokens SET next_page_token = $1 WHERE user_id = $2",
    [token, user_id]
  );
}
module.exports = {
  storeDropboxToken,
  getDropboxTokenByUserId,
  getDropboxNextPageTokenByUserId,
  setDropboxNextPageToken,
  getDropboxPhotoIDByPhotoId
};
