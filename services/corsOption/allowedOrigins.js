require("dotenv").config();
/*le module allowedOrigins qui défini  une liste des domaines autorisés */
let allowedOrigins = [];
if (process.env.NODE_ENV === "production")
  allowedOrigins = [process.env.url_prod];
else if (process.env.NODE_ENV === "staging")
  allowedOrigins = [process.env.url_staging];
else allowedOrigins = [process.env.url_dev + process.env.PORT];

module.exports = allowedOrigins;
