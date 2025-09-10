// Fichier : app.js

const express = require('express');
const bodyParser = require('body-parser');
const { checkLanguage } = require('./middlewares/checkLangauge');

const app = express();

// NE PLUS APPELER connectDB() ICI.
// connectDB(); // <--- SUPPRIMER CETTE LIGNE

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(checkLanguage, (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./routes')(app);

module.exports = app;