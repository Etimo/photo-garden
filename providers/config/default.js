module.exports = {
  // Config for Google Drive provider
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT_URI: process.env.GOOGLE_CLIENT_REDIRECT_URI || "http://localhost:8080/providers/google-drive/auth/start",
  QUEUE_HOST: "queue",
  QUEUE_PORT: "5672",
};
