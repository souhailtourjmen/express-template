/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");

const config = require("../config");

const checkIfAuthenticated = async (req, res, next) => {
    const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token)
        return res.status(401).json({
            mensaje: "No token provided",
            status: 401,
        });

    jwt.verify(token, config.JWT_REFRECH_SECRET, (err, decoded) => {
        if (err)
            return res
                .status(401)
                .json({ message: "Invalid token", data: decoded, status: 401 });
        req.auth = {
            idUser: decoded.id,
        };
        next();
    });
};
const addUser = async (req, res, next) => {
    if (req?.headers?.authorization) {
        const token =
            req?.headers?.authorization && req?.headers?.authorization?.split(" ")[1];

        if (!token) {
            req.auth = {
                idUser: null,
            };
        }

        jwt.verify(token, config.JWT_REFRECH_SECRET, (err, decoded) => {
            if (err)
                return res
                    .status(401)
                    .json({ message: "Invalid token", data: decoded, status: 401 });
            req.auth = {
                idUser: decoded.id,
            };
        });
    }else{
         req.auth = {
                idUser: null,
            };
    }
    next();
};

/**
 * 2. Middleware de Vérification de Rôle : Docteur
 * À utiliser APRES `authMiddleware`.
 * Vérifie si l'utilisateur authentifié a le rôle 'doctor'.
 */
const isDoctor = (req, res, next) => {
    // req.user est défini par le middleware `authMiddleware`
    if (req.user && req.user.roles && req.user.roles.includes("doctor")) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Accès refusé. Rôle de docteur requis.",
        status: 403, // 403 Forbidden : authentifié mais pas autorisé
    });
};

/**
 * 3. Middleware de Vérification de Rôle : Patient
 * À utiliser APRES `authMiddleware`.
 * Vérifie si l'utilisateur authentifié a le rôle 'patient'.
 */
const isPatient = (req, res, next) => {
    if (req.user && req.user.roles && req.user.roles.includes("patient")) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Accès refusé. Rôle de patient requis.",
        status: 403,
    });
};

module.exports = {
    checkIfAuthenticated,
    isDoctor,
    isPatient,
    addUser,
};
