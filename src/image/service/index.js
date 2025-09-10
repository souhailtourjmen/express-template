const mongoose = require("mongoose");
const Image = require("../models/index");
const cloudinary = require("../../../config/cloudinary");
const createImage = async (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { _path, _thumbnail } = image;

      if (!_path || !_thumbnail) {
        return reject({
          success: false,
          message: "All fields are required in file create image",
        });
      }
      const newimage = new Image({
        path: _path,
        thumbnail: _thumbnail,
      });

      const savedImage = await newimage.save();

      return resolve(newimage);
    } catch (error) {
      console.log(error);
      return reject({
        success: false,
        message: "something went wrong, fail to create image",
      });
    }
  });
};

const createAllImage = async (images) => {
  try {
    if (!images) {
      return Promise.reject({
        success: false,
        message: "All fields are required",
      });
    }
    const imagePromises = await images.map((image) => createImage(image));
    return Promise.all(imagePromises)
      .then((createdimages) => {
        return {
          success: true,
          message: "images created successfully",
          dataImages: createdimages,
        };
      })
      .catch((error) => {
        return {
          success: false,
          message: "images created faild ",
          error: error,
        };
      });
  } catch (error) {
    return reject({
      success: false,
      message: "server side error in image",
      error: error,
    });
  }
};
// service/image.service.js

/**
 * Le service de gestion des images.
 */
class ImageService {
  /**
   * Gère la logique après qu'une image ait été téléversée.
   * Le middleware 'multer-storage-cloudinary' a déjà fait le travail de téléversement.
   * Le rôle de ce service est de valider le résultat et de le formater.
   *
   * @param {Object} file - L'objet fichier fourni par Multer après le téléversement sur Cloudinary.
   * @returns {Object} Un objet contenant l'URL et l'ID public de l'image.
   * @throws {Error} Si aucun fichier n'a été fourni.
   */
  static async uploadProfileImage(file) {
    if (!file) {
      throw new Error("Aucun fichier fourni pour le téléversement.");
    }
    const originalPath = file.path;

    // On insère les transformations automatiques dans l'URL
    const transformation = 'f_auto,q_auto';
    const urlParts = originalPath.split('/upload/');

    // On reconstruit l'URL avec les optimisations
    const optimizedPath = `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`;
    const result = await createImage({
      _path: optimizedPath,
      _thumbnail: file.filename,
    });
    return result;
  }
  /**
   * Supprime une image de Cloudinary et de la base de données MongoDB.
   * C'est une opération de nettoyage critique.
   *
   * @param {String} imageId - L'ID MongoDB du document Image à supprimer.
   * @returns {Promise<void>} Ne retourne rien, effectue une action.
   */
  static async deleteImage(imageId) {
    try {
      if (!imageId || !mongoose.Types.ObjectId.isValid(imageId)) {
        return;
      }

      const imageDoc = await Image.findById(imageId);

      if (!imageDoc) {
        console.warn(
          `[ImageService.deleteImage] Image non trouvée dans la DB avec l'ID: ${imageId}.`,
        );
        return;
      }

      await cloudinary.uploader.destroy(imageDoc.thumbnail);

      await Image.findByIdAndDelete(imageId);

      console.log(
        `[ImageService.deleteImage] Image ${imageId} (publicId: ${imageDoc.publicId}) supprimée avec succès.`,
      );
    } catch (error) {
      console.error(
        `[ImageService.deleteImage] Erreur lors de la suppression de l'image ${imageId}:`,
        error.message,
      );
    }
  }
}

module.exports = {
  createImage,
  createAllImage,
  ImageService,
};
