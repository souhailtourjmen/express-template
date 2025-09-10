const allowedOrigins = require("./allowedOrigins");

/*
 * The corsOptions function takes a list of allowed origins for CORS requests as input 
 * and returns an object containing configuration options for CORS
 * Configures CORS options for an HTTP server, allowing cross-origin resource sharing.
 * @param {array} allowedOrigins - A list of allowed origins for CORS requests.
 * @returns {object} - An object containing CORS configuration options.
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
console.log(allowedOrigins);

module.exports = corsOptions;
