const express = require("express");
const router = express.Router();
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./utils/index');
const PatientController = require("./controller/index");
const PRIFIX = "/patient"
    /**
     * Get patient by ID
     */
router.get(`${PRIFIX}/:id`, PatientController.getById);


/**
 * Create a new guest patient
 */
router.post(`${PRIFIX}/guest`, validateSchemas.inputs(schemas.geuest, 'body'), // Create a new user
    (req, res) => {
        PatientController.createGuestPatient(res, req.body);
    });

/**
 * Update patient information
 */
router.put(`${PRIFIX}/:id`, PatientController.update);

module.exports = router;

router.post(
    `${PRIFIX}/register`,
    validateSchemas.inputs(schemas.signUp, 'body'), // Create a new user
    (req, res) => {
        PatientController.create(res, req.body);
    }
);
module.exports = router;