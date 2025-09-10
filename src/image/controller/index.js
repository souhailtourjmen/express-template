const UserService = require("../../users/services");
const { ImageService } = require("../service");

/**
 * Le contrôleur pour les requêtes liées aux images.
 */
class ImageController {
  /**
   * Gère la requête de téléversement d'une image de profil.
   * @param {Object} req - L'objet de la requête Express. `req.file` est ajouté par Multer.
   * @param {Object} res - L'objet de la réponse Express.
   */
  static async uploadProfileImage(req, res) {
    try {
      const userId = req.auth.idUser;
      const imageData = await ImageService.uploadProfileImage(req.file);
      if (imageData) {
        const result = await UserService.updateProfileImage(
          userId,
          imageData._id,
        );
        res.status(result.status || 200).json(result);

      }
      else {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      // Le contrôleur gère les erreurs renvoyées par le service et envoie une réponse HTTP appropriée.
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ImageController;
