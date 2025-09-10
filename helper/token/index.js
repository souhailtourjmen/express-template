const jwt = require("jsonwebtoken");
require("dotenv").config();
getToken = async(params) => {
    return jwt.sign(params, process.env.API_KEY_JWT, {
        expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
};
refreshToken = async(params) => {
    return jwt.sign(params, process.env.JWT_REFRECH_SECRET, {
        expiresIn: process.env.JWT_REFRECH_EXPIRE,
    });
};
module.exports = {
    getToken,
    refreshToken,
};