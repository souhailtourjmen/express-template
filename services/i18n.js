const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'fr', 'ar'],
    directory: path.join(__dirname, './../translations'),
    defaultLocale: 'en',
    objectNotation: true
});
module.exports = i18n;