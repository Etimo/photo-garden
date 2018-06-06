const config = require("config");
const logger = require("logging");

const dbClient = require("db").create("garden");

async function attachIdentity(provider, providerIdentity) {
  // FIXME: Ask for username?
  logger.info(`Attaching identity ${providerIdentity} to ${provider}`);
  const db = await dbClient.connect();
  try {
    db.query("BEGIN");
    const userResponse = await dbClient.query(
      "INSERT INTO users(username) VALUES($1) RETURNING id",
      [providerIdentity]
    );
    const userId = userResponse.rows[0].id;
    await dbClient.query(
      "INSERT INTO user_identities(user_id, provider, provider_id) VALUES($1, $2, $3)",
      [userId, provider, providerIdentity]
    );
    await db.query("COMMIT");
    return userId;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  } finally {
    db.release();
  }
}
async function attachProvider(provider, providerIdentity) {
  // FIXME: Ask for username?
  logger.info(`Attaching identity ${providerIdentity} to ${provider}`);
  const db = await dbClient.connect();
  try {
    db.query("BEGIN");
    const userResponse = await dbClient.query(
      "INSERT INTO users(username) VALUES($1) RETURNING id",
      [providerIdentity]
    );
    const userId = userResponse.rows[0].id;
    await dbClient.query(
      "INSERT INTO user_identities(user_id, provider, provider_id) VALUES($1, $2, $3)",
      [userId, provider, providerIdentity]
    );
    await db.query("COMMIT");
    return userId;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  } finally {
    db.release();
  }
}
async function getDropboxTokenByUserId(user_id) {
  const response = await dbClient.query(
    "SELECT token FROM dropbox_tokens WHERE user_id = $1 ",
    [user_id]
  );
  return response.rows[0].token || undefined;
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
async function getByIdentity(provider, providerIdentity) {
  logger.info(`Get identity for ${providerIdentity} for provider ${provider}`);
  const response = await dbClient.query(
    "SELECT user_id FROM user_identities WHERE provider=$1 AND provider_id=$2",
    [provider, providerIdentity]
  );

  if (response.rows[0] !== undefined) {
    return response.rows[0].user_id;
  } else {
    return attachIdentity(provider, providerIdentity);
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
async function setDropboxNextPageToken(user_id) {
  const token = await getDropboxNextPageTokenByUserId(user_id);
  const response = await dbClient.query(
    "UPDATE dropbox_tokens SET next_page_token = $1 WHERE user_id = $2",
    [token + 1, user_id]
  );
}
module.exports = {
  getByIdentity,
  storeDropboxToken,
  getDropboxTokenByUserId,
  getDropboxNextPageTokenByUserId,
  setDropboxNextPageToken
};
