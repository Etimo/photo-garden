const { Pool: PgPool } = require("pg");
const dbClient = new PgPool();

async function attachIdentity(provider, providerIdentity) {
  // FIXME: Ask for username?
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

async function getByIdentity(provider, providerIdentity) {
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

module.exports = {
  getByIdentity
};
