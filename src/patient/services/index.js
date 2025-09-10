const { Patient } = require("../models");
const { createAddress } = require("../../address/service");
require("dotenv").config();
const {
    handleSuccessResponse,
    handleErrorResponse,
} = require("../../utils/index");

// Utility function to sanitize patient objects
function sanitizePatient(patientObj) {
    const sanitized = { ...patientObj };
    delete sanitized.role;
    delete sanitized.password;
    delete sanitized._id;
    return sanitized;
}

class PatientService {
    /**
     * Update patient information
     * @param {Object} body
     * @param {Object} patientFound
     * @returns {Object} Updated patient
     */
    static async updateInfo(body, patientFound) {
        try {
            const {
                cin,
                firstName,
                lastName,
                phone,
                gender,
                email,
                address,
                medicalHistory,
                dateOfBirth,
            } = body;

            const updates = {
                ...(cin && { cin }),
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone && { phone }),
                ...(gender && { gender }),
                ...(email && { email }),
                ...(address && { address }),
                ...(medicalHistory && { medicalHistory }),
                ...(dateOfBirth && { dateOfBirth }),
            };

            if (Object.keys(updates).length === 0) {
                return handleErrorResponse("No fields to update", false, null, 400);
            }

            const updatedPatient = await Patient.findByIdAndUpdate(
                patientFound.id,
                updates, { new: true },
            );
            return updatedPatient ?
                handleSuccessResponse("Patient updated successfully", updatedPatient) :
                handleErrorResponse("Error updating patient info", false, null, 500);
        } catch (error) {
            console.error(`[updateInfo] Error: ${error.message}`);
            return handleErrorResponse("Server error updating patient info");
        }
    }

    /**
     * Create a new patient
     * @param {Object} body
     * @returns {Object} Created patient
     */
    static async create(body) {
            try {
                const {
                    firstName,
                    lastName,
                    address,
                    phone,
                    email,
                    password,
                    dateOfBirth,
                    medicalHistory,
                    cin
                } = body;

                const createdAddress = address ?
                    (await createAddress(address)).data :
                    null;
                const patient = new Patient({
                    cin,
                    firstName,
                    lastName,
                    address: createdAddress ? [createdAddress] : [],
                    phone,
                    email,
                    password,
                    dateOfBirth,
                    medicalHistory,
                });
                patient._isNewUser = 1;
                const savedPatient = await patient.save();
                if(savedPatient){
                  const patientObj = sanitizePatient(savedPatient.toObject());
                  return handleSuccessResponse(
                        "Patient created successfully",
                        patientObj,
                        201,
                    );
                }
                
                return handleErrorResponse("Failed to create patient", false, null, 400);
            } catch (error) {
                console.error(`[create] Error: ${error.message}`);
                return handleErrorResponse("Server error creating patient");
            }
        }
        /**
         * Create a new patient
         * @param {Object} body
         * @returns {Object} Created patient
         */
    static async createGuestPatient(body) {
        try {
            const { firstName, lastName, phone, email, dateOfBirth } = body;

            const patient = new Patient({
                firstName,
                lastName,
                phone,
                email,
                dateOfBirth,
            });
            patient._isNewUser = 1;
            const savedPatient = await patient.save();
            return savedPatient ?
                handleSuccessResponse(
                    "Patient created successfully",
                    savedPatient,
                    201,
                ) :
                handleErrorResponse("Failed to create patient", false, null, 400);
        } catch (error) {
            console.error(`[create] Error: ${error.message}`);
            return handleErrorResponse("Server error creating patient");
        }
    }
}

module.exports = PatientService;