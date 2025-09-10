const UserService = require("../services/index");

class UserController {
    /**
     * Get a User by ID
     * @param {Request} req
     * @param {Response} res
     */
    static async getById(req, res) {
        try {
            const id = req.auth.idUser;
            const result = await UserService.getById(id);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[getById] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }

    /**
     * Check user credentials
     * @param {Request} req
     * @param {Response} res
     */
    static async checkCredentials(req, res) {
        try {
            const result = await UserService.checkCredentials(req.body);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[checkCredentials] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }

    /**
     * Check if email exists
     * @param {Request} req
     * @param {Response} res
     */
    static async checkEmail(req, res) {
        try {
            const result = await UserService.checkEmail(req.body);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[checkEmail] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }
    /**
     * Update user password
     * @param {Request} req
     * @param {Response} res
     */
    static async changePassword(req, res) {
        try {
            const id = req.auth.idUser;
            const { password, newPassword } = req.body;

            if (!id || !password || !newPassword) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "User ID, current password, and new password are required",
                    });
            }

            const result = await UserService.updateUserPassword(
                password,
                newPassword,
                id,
            );

            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error(`[changePassword] Error: ${error.message}`);
            return res
                .status(500)
                .json({ success: false, message: "Server error updating password" });
        }
    }
    /**
     * Delete user
     * @param {Request} req
     * @param {Response} res
     */
    static async deleteUser(req, res) {
        try {
            const id = req.auth.idUser;

            if (!id) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "User ID, current password, and new password are required",
                    });
            }

            const result = await UserService.deleteUser(id);

            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[changePassword] Error: ${error.message}`);
            return res
                .status(500)
                .json({ success: false, message: "Server error updating password" });
        }
    }
    /**
* Update user information
* @param {Request} req
* @param {Response} res
*/
    static async updateUser(req, res) {
        try {
            const id = req.auth.idUser;
            const result = await UserService.updateUser(req.body, id);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[update] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }
    /**
     * Forgot password
     * @param {Request} req
     * @param {Response} res
     */
    static async forgotPassword(req, res) {
        try {
            const { password, email } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "User ID, current password  are required",
                    });
            }
            const result = await UserService.forgotPassword(password, email);

            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error(`[changePassword] Error: ${error.message}`);
            return res
                .status(500)
                .json({ success: false, message: "Server error updating password" });
        }
    }

    /**
     * Rechercher des utilisateurs par nom, email ou téléphone
     * @param {Request} req
     * @param {Response} res
     */
    static async searchUsers(req, res) {
        try {
            const { name, email, phone } = req.query;

            // Vérifier qu'au moins un paramètre est fourni
            if (!name && !email && !phone) {
                return res.status(400).json({
                    success: false,
                    message: "Veuillez fournir au moins un paramètre: name, email ou phone",
                });
            }

            // Appeler le service UserService avec les paramètres
            const result = await UserService.search({ name, email, phone });

            // Retourner le résultat de la recherche
            return res.status(result.success ? 200 : result.status || 400).json(result);
        } catch (error) {
            console.error(`[searchUsers] Error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de la recherche d'utilisateurs",
            });
        }
    }
}

module.exports = UserController;