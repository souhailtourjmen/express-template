const express = require('express');
const UserController = require('./controller/index');
const { checkIfAuthenticated } = require('../../middlewares/validateAuth');

const router = express.Router();

// Get a User by ID
router.get('/', checkIfAuthenticated, UserController.getById);

router.delete('/', checkIfAuthenticated, UserController.deleteUser);

// Check user credentials
router.post('/login', UserController.checkCredentials);

// Check if email exists
router.post('/check-email', UserController.checkEmail);

// Check if email exists
router.put('/updateUser',checkIfAuthenticated, UserController.updateUser);

// Change user password
router.patch('/change-password', checkIfAuthenticated, UserController.changePassword);
// forgotPassword
router.patch('/forgot-Password', UserController.forgotPassword);

/**
 * Route pour rechercher des utilisateurs
 * GET /users/search
 */
router.get("/search", checkIfAuthenticated, UserController.searchUsers);

module.exports = router;