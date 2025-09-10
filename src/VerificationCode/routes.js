const express = require('express');
const emailController = require("./controller");


const router = express.Router();

// Vérifier l'email ou envoyer un code
router.post("/check-email", emailController.checkEmail);

// Vérifier un code soumis par l'utilisateur
router.post("/verify-code", emailController.verifyCode);

module.exports = router;
