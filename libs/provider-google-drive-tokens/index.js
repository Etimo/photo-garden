const dbClient = require("db").create("garden");

async function updateNextPageToken(userId, nextPageToken) {
  return dbClient.query(
    "INSERT INTO user_google_drive_tokens(user_id, next_page_token) VALUES($1, $2) ON CONFLICT (user_id) DO UPDATE SET next_page_token=$2",
    [userId, nextPageToken]
  );
}

async function updateTokens(userId, tokens) {
  return dbClient.query(
    "INSERT INTO user_google_drive_tokens(user_id, tokens) VALUES($1, $2) ON CONFLICT (user_id) DO UPDATE SET tokens=$2",
    [userId, JSON.stringify(tokens)]
  );
}

async function getTokens(userId) {
  const response = await dbClient.query(
    "SELECT tokens FROM user_google_drive_tokens WHERE user_id=$1",
    [userId]
  );
  if (response.rows[0] !== undefined) {
    return response.rows[0].tokens;
  } else {
    return null;
  }
}

async function getNextPageToken(userId) {
  const response = await dbClient.query(
    "SELECT next_page_token FROM user_google_drive_tokens WHERE user_id=$1",
    [userId]
  );
  if (response.rows[0] !== undefined) {
    return response.rows[0].next_page_token;
  } else {
    return null;
  }
}

module.exports = {
  updateTokens,
  updateNextPageToken,
  getTokens,
  getNextPageToken
};
