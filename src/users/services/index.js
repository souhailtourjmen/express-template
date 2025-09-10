const { User } = require("../models");
const i18n = require("../../../services/i18n");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  handleSuccessResponse,
  handleErrorResponse,
  filterObjectFields,
} = require("../../utils/index");
const { ImageService } = require("../../image/service");

class UserService {
  static SENSITIVE_USER_FIELDS = [
    "password",
    "role",
    "address",
    "__v",
    "resetPasswordToken",
  ];

  /**
   * Récupérer les informations détaillées d'un utilisateur par son ID.
   * @param {String} id - L'ID de l'utilisateur.
   * @returns {Object} Un objet contenant le statut et les données de l'utilisateur ou une erreur.
   */
  static async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return handleErrorResponse(i18n.__("invalid_id"), false, null, 400);
      }

      const aggregationPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            as: "imageDetails",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "address",
            foreignField: "_id",
            as: "addressDetails",
          },
        },
        {
          $unwind: {
            path: "$imageDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            cin: 1,
            firstName: 1,
            lastName: 1,
            phone: 1,
            email: 1,
            dateOfBirth: 1,
            gender: 1,
            language: 1,
            verified: 1,
            createdAt: 1,
            updatedAt: 1,

            // Champs calculés ou formatés à partir des lookups
            image: { $ifNull: ["$imageDetails.path", null] },
            addresses: "$addressDetails", // On peut nettoyer ce champ si besoin
          },
        },
      ];

      const results = await User.aggregate(aggregationPipeline);

      if (results.length === 0) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }

      const user = results[0];

      return handleSuccessResponse(i18n.__("user_fetched_successfully"), user);
    } catch (error) {
      console.error(`[UserService.getById] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("error_fetching_user"));
    }
  }

  /**
   * Vérifier un user par ID
   * @param {String} id
   * @returns {Object} user trouvé
   */
  static async checkId(id) {
    try {
      const userFound = await User.findById(id);
      if (!userFound) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }
      return handleSuccessResponse(
        i18n.__("user_fetched_successfully"),
        userFound,
      );
    } catch (error) {
      console.error(`[checkId] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("error_fetching_user"));
    }
  }

  /**
   * Vérifier les identifiants d'un user
   * @param {Object} body
   * @returns {Object} user authentifié avec un token
   */
  static async checkCredentials(body) {
    try {
      const { email, password } = body;
      if (!email || !password) {
        return handleErrorResponse(
          i18n.__("email_password_required"),
          false,
          null,
          400,
        );
      }

      const userFound = await User.findOne({ email });
      if (!userFound) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }

      const isPasswordValid = await userFound.comparePassword(password);
      if (!isPasswordValid) {
        return handleErrorResponse(
          i18n.__("invalid_password"),
          false,
          null,
          401,
        );
      }

      const refreshedToken = await userFound.refreshToken();
      return refreshedToken
        ? handleSuccessResponse(i18n.__("user_authenticated_successfully"), {
          email: userFound.email,
          image: userFound.image,
          lastName: userFound.lastName,
          firstName: userFound.firstName,
          phone: userFound.phone,
          token: refreshedToken.auth.token,
          dateOfBirth: refreshedToken.dateOfBirth,
        })
        : handleErrorResponse(
          i18n.__("token_refresh_failed"),
          false,
          null,
          500,
        );
    } catch (error) {
      console.error(`[checkCredentials] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("server_error_authenticating_user"));
    }
  }

  /**
   * Vérifier si un email existe
   * @param {Object} body
   * @returns {Object} user correspondant
   */
  static async checkEmail(body) {
    try {
      const { email } = body;
      if (!email) {
        return handleErrorResponse(i18n.__("email_required"), false, null, 400);
      }
      const userFound = await User.findOne({ email }).select("-_id lastName firstName");
      if (!userFound) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }

      return handleSuccessResponse(
        i18n.__("email_exists"),
        userFound.toObject(),
      );
    } catch (error) {
      console.error(`[checkEmail] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("server_error_checking_email"));
    }
  }
  /**
   *
   * @param {*} password
   * @param {*} newPassword
   * @param {*} id
   * @returns
   */
  static async updateUserPassword(password, newPassword, id) {
    try {
      if (!password || !newPassword) {
        throw new Error(i18n.__("passwords_required"));
      }
      const userFound = await User.findById(id);

      if (!userFound) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404); // Handle the case where the user is not found
      }

      const isMatch = await userFound.comparePassword(password);

      if (!isMatch) {
        return handleErrorResponse(
          i18n.__("invalid_current_password"),
          false,
          null,
          400,
        );
      }

      const hashedPassword = await userFound.encryptPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(
        userFound.id,
        { password: hashedPassword },
        { new: true },
      );

      return updatedUser
        ? handleSuccessResponse(
          i18n.__("password_updated_successfully"),
          updatedUser,
          201,
        )
        : handleErrorResponse(
          i18n.__("error_updating_password"),
          false,
          null,
          500,
        );
    } catch (error) {
      console.error(`[updateUserPassword] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("error_updating_password"));
    }
  }

  /**
   *
   * @param {*} password
   * @param {*} email
   * @returns
   */
  static async forgotPassword(password, email) {
    try {
      if ((!password, !email)) {
        throw new Error(i18n.__("password_required"));
      }
      const userFound = await User.findOne({ email });
      const hashedPassword = await userFound.encryptPassword(password);
      const updatedUser = await User.findByIdAndUpdate(
        userFound.id,
        { password: hashedPassword },
        { new: true },
      );

      return updatedUser
        ? handleSuccessResponse(
          i18n.__("password_updated_successfully"),
          updatedUser,
          201,
        )
        : handleErrorResponse(
          i18n.__("error_updating_password"),
          false,
          null,
          500,
        );
    } catch (error) {
      console.error(`[forgotPassword] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("error_updating_password"));
    }
  }

  static async deleteUser(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }

      if (user.isDeleted) {
        return handleErrorResponse(
          i18n.__("user_already_deletedd"),
          false,
          null,
          404,
        );
      }

      user.isDeleted = true;
      user.email = `${user.email}_${new Date().getMilliseconds()}`;
      await user.save();

      return handleSuccessResponse(
        i18n.__("User_deleted_successfully"),
        null,
        204,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   * Rechercher des utilisateurs par nom, email ou téléphone
   * @param {Object} filters - Filtres de recherche
   * @param {String} [filters.name] - Prénom ou nom
   * @param {String} [filters.email] - Email
   * @param {String} [filters.phone] - Numéro de téléphone
   * @returns {Object} Résultat de la recherche
   */
  static async search(filters) {
    try {
      const matchStage = {};

      // Construction dynamique des filtres
      if (filters.name) {
        matchStage.$or = [
          { firstName: new RegExp(filters.name, "i") },
          { lastName: new RegExp(filters.name, "i") },
        ];
      }
      if (filters.email) {
        matchStage.email = new RegExp(filters.email, "i");
      }
      if (filters.phone) {
        matchStage.phone = new RegExp(filters.phone, "i");
      }

      // Pipeline d'agrégation
      const users = await User.aggregate([
        { $match: matchStage }, // Filtrer les utilisateurs
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            dateOfBirth: 1,
          },
        },
      ]);

      if (users.length === 0) {
        return handleErrorResponse(i18n.__("no_users_found"), false, null, 404);
      }

      return handleSuccessResponse(
        i18n.__("users_fetched_successfully"),
        users,
      );
    } catch (error) {
      console.error(`[search] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("error_searching_users"));
    }
  }
  /**
   * Mettre à jour les informations d'un docteur
   * @param {Object} body
   * @param {Object} doctorFound
   * @returns {Object} Docteur mis à jour
   */
  static async updateUser(body, userId) {
    try {
      const { firstName, lastName, phone, gender, email, dateOfBirth } = body;

      const updates = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(gender && { gender }),
        ...(email && { email }),
        ...(dateOfBirth && { dateOfBirth }),
      };
      if (Object.keys(updates).length === 0) {
        return handleErrorResponse(
          i18n.__("no_fields_to_update"),
          false,
          null,
          400,
        );
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });
      if (updatedUser) {
        const filteredResponse = filterObjectFields(
          updatedUser,
          this.SENSITIVE_USER_FIELDS,
        );

        return handleSuccessResponse(
          i18n.__("doctor_updated_successfully"),
          filteredResponse, // Pass the filtered object
        );
      } else {
        return handleErrorResponse(
          i18n.__("error_updating_doctor_info"),
          false,
          null,
          500,
        );
      }
    } catch (error) {
      console.error(`[updateInfo] Error: ${error.message}`);
      return handleErrorResponse(i18n.__("server_error_updating_doctor_info"));
    }
  }
  /**
   * Met à jour l'image de profil d'un utilisateur en utilisant findByIdAndUpdate.
   * Gère la suppression de l'ancienne image de manière atomique.
   * @param {String} userId - L'ID de l'utilisateur à mettre à jour.
   * @param {String} newImageId - L'ID du nouveau document Image.
   * @returns {Object} Le résultat contenant l'utilisateur mis à jour.
   */
  static async updateProfileImage(userId, newImageId) {
    try {
      // 1. Valider les IDs
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(newImageId)
      ) {
        return handleErrorResponse(i18n.__("invalid_id"), false, null, 400);
      }

      const oldUserVersion = await User.findByIdAndUpdate(userId, {
        $set: { image: newImageId },
      });

      if (!oldUserVersion) {
        await ImageService.deleteImage(newImageId.toString());
        return handleErrorResponse(i18n.__("user_not_found"), false, null, 404);
      }

      // 4. (Nettoyage) Si une ancienne image existait, la supprimer
      const oldImageId = oldUserVersion.image;
      if (oldImageId) {
        await ImageService.deleteImage(oldImageId.toString());
      }

      return this.getById(userId);
    } catch (error) {
      console.error(`[UserService.updateProfileImage] Error: ${error.message}`);
      // En cas d'erreur, essayez de supprimer la nouvelle image pour éviter les orphelins
      if (newImageId) {
        await ImageService.deleteImage(newImageId.toString());
      }
      return handleErrorResponse(i18n.__("error_updating_profile_image"));
    }
  }
}

module.exports = UserService;
