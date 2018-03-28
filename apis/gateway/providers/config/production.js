module.exports = {
  // Config for Google Drive provider
  GOOGLE_CLIENT_REDIRECT_URI:
    process.env.GOOGLE_CLIENT_REDIRECT_URI ||
    "http://localhost:3000/google-drive/auth/start",
  QUEUE_HOST: "176.34.148.213",
  QUEUE_PORT: "5672"
};
