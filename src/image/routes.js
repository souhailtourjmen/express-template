// src/image/routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");

// Assurez-vous que le chemin vers votre controller est correct
const ImageController = require("./controller/index");
const upload = require("../../middlewares/upload");

/**
 * @route   POST /api/v1/images/profile
 * @desc    Téléverser une image de profil
 */
// CORRECTION : Le chemin est maintenant relatif au préfixe '/api/v1/images'
// Il faut commencer par un slash '/'
router.post(
  "/profile", // On peut utiliser un nom plus logique comme '/profile' ou '/upload'
  upload.single("image"),
  ImageController.uploadProfileImage,
);

// Votre gestionnaire d'erreurs reste identique, c'est parfait.
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Le fichier est trop volumineux (max 5MB).",
        });
    }
  }
  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
});

module.exports = router;
