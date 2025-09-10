const i18n = require('../services/i18n');

const checkLanguage = async(req, res, next) => {
    if (req.headers.language && ['ar', 'fr', 'en'].includes(req.headers.language)) {
        i18n.setLocale(req.headers.language);
    } else {
        req.headers.language = 'fr';
        i18n.setLocale('fr');
    }
    next();
};

module.exports = { checkLanguage };