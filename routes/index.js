// const getData = require('../middlewares/getData');
const path = require('path');
const users = require('../src/users/routes');
const emailRoutes = require('../src/VerificationCode/routes');
const PatientRoutes = require('../src/patient/routes');
const ImagesRouter = require('../src/image/routes');
const { checkIfAuthenticated } = require('../middlewares/validateAuth');
const PRIFIX = "/api/v1/"
module.exports = (app) => {
    // =============================================================
    //          ROUTE PUBLIQUE POUR LA POLITIQUE DE CONFIDENTIALITÉ
    // =============================================================
    // Cette route est publique et ne nécessite pas d'authentification.
    // Elle doit être placée avant les routes protégées.
    app.get(`${PRIFIX}privacy-policy`, (req, res) => {
        res.sendFile(path.join(__dirname, '../', 'public', 'privacy.html'));
    });
    app.get(`${PRIFIX}about`, (req, res) => {
        res.sendFile(path.join(__dirname, '../', 'public', 'about.html'));
    });
    app.get(`${PRIFIX}faq`, (req, res) => {
        res.sendFile(path.join(__dirname, '../', 'public', 'FAQ.html'));
    });
    app.get(`${PRIFIX}help`, (req, res) => {
        res.sendFile(path.join(__dirname, '../', 'public', 'Helper.html'));
    });

    // =============================================================
    //          VOS ROUTES API privet
    // =============================================================
    app.use(`${PRIFIX}users`, users);
    app.use(`${PRIFIX}email`, emailRoutes);
    app.use(`${PRIFIX}`, PatientRoutes);
    app.use(`${PRIFIX}images`, checkIfAuthenticated, ImagesRouter);


    // app.use('/users', validateAuth.checkIfAuthenticated, getData.getGeoip, users);
    app.use('*', (req, res) => {
        res.send('Not found!!!');
    });
};