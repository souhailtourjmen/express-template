const Joi = require('@hapi/joi');

// Define schemas for validation
const schemas = {
    geuest: Joi.object().keys({
        dateOfBirth: Joi.date(),
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(15)
            .required()
            .messages({
                "string.pattern.base": "Phone must contain only digits",
                "string.min": "Phone must be at least 8 digits long",
            }),
        gender: Joi.string().valid("0", "1").optional(),
        address: Joi.object().keys({
            place_id: Joi.string().optional(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            location: Joi.object().keys({
                lat: Joi.number().required(),
                lng: Joi.number().required(),
            }),
            postalCode: Joi.string()
                .pattern(/^[0-9]+$/)
                .min(4)
                .max(6)
                .required()
                .messages({
                    "string.pattern.base": "Postal Code must contain only digits",
                }),
        }).optional(),
    }),
    signUp: Joi.object().keys({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .required()
            .messages({
                "string.min": "Password must be at least 8 characters long",
            }),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(15)
            .required()
            .messages({
                "string.pattern.base": "Phone must contain only digits",
                "string.min": "Phone must be at least 8 digits long",
            }),
        cin: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(8)
            .optional()
            .messages({
                "string.pattern.base": "Cin must contain only digits",
                "string.min": "Phone must be at least 8 digits long",
            }),
        gender: Joi.string().valid("0", "1").optional(),
        address: Joi.object().keys({
            place_id: Joi.string().optional(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            location: Joi.object().keys({
                lat: Joi.number().required(),
                lng: Joi.number().required(),
            }),
            postalCode: Joi.string()
                .pattern(/^[0-9]+$/)
                .min(4)
                .max(6)
                .required()
                .messages({
                    "string.pattern.base": "Postal Code must contain only digits",
                }),
        }).optional(),
    }),
};

module.exports = schemas;