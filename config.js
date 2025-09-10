require('dotenv').config();

const config = {
    port: 3000,
    dbUrlMongoDB: process.env.dbUrlMongoDB,
    API_KEY_JWT: process.env.API_KEY_JWT,
    JWT_REFRECH_SECRET: process.env.JWT_REFRECH_SECRET,
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
};


module.exports = config;