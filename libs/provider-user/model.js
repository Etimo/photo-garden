const config = require("config");
const logger = require("logging");

const dbClient = require("db").create("garden");

async function attachIdentity(provider, providerIdentity, existingUserId) {
  // FIXME: Ask for username?
  logger.info(
    `Attaching identity ${providerIdentity} to ${provider} (existing user id: ${existingUserId})`
  );
  const db = await dbClient.connect();
  let userId;
  try {
    db.query("BEGIN");
    if (existingUserId) {
      // const userResponse = await dbClient.query(
      //   "INSERT INTO users(id, username) VALUES($1, $2) RETURNING id",
      //   [existingUserId, providerIdentity]
      // );
      userId = existingUserId;
    } else {
      const userResponse = await dbClient.query(
        "INSERT INTO users(username) VALUES($1) RETURNING id",
        [providerIdentity]
      );
      userId = userResponse.rows[0].id;
    }
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

async function getByIdentity(provider, providerIdentity, existingUserId) {
  logger.info(`Get identity for ${providerIdentity} for provider ${provider}`);
  const response = await dbClient.query(
    "SELECT user_id FROM user_identities WHERE provider=$1 AND provider_id=$2",
    [provider, providerIdentity]
  );

  if (response.rows[0] !== undefined) {
    return response.rows[0].user_id;
  } else {
    return attachIdentity(provider, providerIdentity, existingUserId);
  }
}

module.exports = {
  getByIdentity
};
