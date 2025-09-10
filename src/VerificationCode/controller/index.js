const { User } = require("../../users/models");
const VerificationCode = require("../models");
const { sendVerificationEmail } = require("../service");
const crypto = require("crypto");
const i18n = require("../../../services/i18n");

const emailController = {
    checkEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: i18n.__("emailRequired") });
            }
            const code = crypto.randomInt(100000, 999999).toString();
            await VerificationCode.updateOne({ email }, {
                email,
                code,
            }, { upsert: true });
            const userFound = await User.findOne({ email });
            if (userFound) {
                await sendVerificationEmail(email, code, "password");
                return res.status(200).json({
                    success: true,
                    message: i18n.__("resetPasswordCodeSent"),
                });
            }

            await sendVerificationEmail(email, code, "verification");

            return res.status(200).json({
                success: true,
                message: i18n.__("verificationCodeSent"),
            });
        } catch (error) {
            console.error(`[checkEmail] Error: ${error.message}`);
            return res.status(500).json({ success: false, message: i18n.__("serverError") });
        }
    },


    verifyCode: async (req, res) => {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                return res.status(400).json({ success: false, message: i18n.__("emailAndCodeRequired") });
            }

            const verificationRecord = await VerificationCode.findOne({ email, code });

            if (!verificationRecord) {
                return res.status(400).json({ success: false, message: i18n.__("invalidOrExpiredCode") });
            }

            await VerificationCode.deleteOne({ _id: verificationRecord._id });

            return res.status(200).json({ success: true, message: i18n.__("codeVerifiedSuccessfully") });
        } catch (error) {
            console.error(`[verifyCode] Error: ${error.message}`);
            return res.status(500).json({ success: false, message: i18n.__("serverError") });
        }
    }

};

module.exports = emailController;