require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  mongoDBConnectionString: process.env.MONGODB_URI,
  sessionSecretString: process.env.SESSION_SECRET_STRING,
};
