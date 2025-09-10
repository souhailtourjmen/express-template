const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const extendSchema = require('mongoose-extend-schema');
const { User, userSchema } = require("../../users/models/index");
const PatientSchema = extendSchema(userSchema, {
    medicalHistory: { type: String },
    favoriteDoctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }]
});
PatientSchema.plugin(uniqueValidator);
const Patient = User.discriminator("Patient", PatientSchema);
module.exports = { Patient };