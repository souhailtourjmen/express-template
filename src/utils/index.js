const mongoose = require('mongoose');
const i18n = require('../../services/i18n');
const { Doctor } = require('../doctors/models');
const TimeSlot = require('../timeSlot/models');
/**
 * The selected code defines a function called handleErrorResponse. This function is designed to create a standardized error response object. Here's a breakdown of its functionality:
1.
The function takes four parameters:
message: A string that describes the error.
success: A boolean indicating whether the operation was successful (default is false for error responses).
data: Any additional data related to the error (default is null).
status: An HTTP status code for the error (default is 500, which typically represents an internal server error).
2.
The function returns an object with four properties:
success: The boolean value passed in or defaulted.
message: The error message string.
data: Any additional error data.
status: The HTTP status code.
3.
This function uses ES6 object shorthand notation, where { success, message, data, status } is equivalent to { success: success, message: message, data: data, status: status }.
The purpose of this function is to provide a consistent structure for error responses across the application. By using this function, developers can ensure that all error responses follow the same format, which can be beneficial for:
Maintaining consistency in API responses
Simplifying error handling on the client-side
Making it easier to log and track errors
Providing clear and structured information about what went wrong
This function is likely used in various parts of the application where error responses need to be sent back to the client, such as in API route handlers or middleware error handlers.

 * @param {*} message 
 * @param {*} success 
 * @param {*} data 
 * @param {*} status 
 * @returns 
 */
const handleErrorResponse = (
    message,
    success = false,
    data = null,
    status = 500,
) => {
    return { success, message, data, status };
};
/** @internal */
/**
 * The selected code snippet defines a function called handleSuccessResponse. This function is used to create a success response object with the following properties:
success: A boolean value indicating that the operation was successful. It is set to true by default.
message: A string representing the message to be included in the response.
data: An optional parameter representing any additional data to be included in the response. It is set to null by default.
status: An optional parameter representing the HTTP status code for the response. It is set to 200 by default, indicating a successful HTTP request.
The function returns an object with these properties, which can be used to send a successful response in a RESTful API or any other application that requires a response format similar to this.
 * @param {*} message 
 * @param {*} data 
 * @param {*} status 
 * @returns 
 */
const handleSuccessResponse = (message, data = null, status = 200) => ({
    success: true,
    message,
    data,
    status,
});
/**
 *
 * @param {*} type
 * @param {*} options
 * @returns
 */
const getEmailTemplate = (type, options) => {
    const { name, code, email } = options;

    switch (type) {
        case "verification":
            return {
                subject: i18n.__("email.verificationSubject"),
                text: `${i18n.__("email.verificationTextHello", { name })}\n\n${i18n.__("email.verificationTextMessage")}\n\n${i18n.__("email.verificationCode", { code })}\n\n${i18n.__("email.verificationTextFooter")}`,
            };

        case "password":
            return {
                subject: i18n.__("email.passwordSubject"),
                text: `${i18n.__("email.passwordTextHello", { name })}\n\n${i18n.__("email.passwordTextMessage")}\n\n${i18n.__("email.passwordResetCode", { code })}\n\n${i18n.__("email.passwordTextFooter")}`,
            };

        default:
            throw new Error(i18n.__("errors.invalidEmailType"));
    }
};



const generateWorkTimeSlots = async (doctorId, workDate, slotDuration = 60) => {
    try {
        // Fetch doctor with availability details
        const doctor = await Doctor.findById(doctorId)
            .populate('availability'); // Assuming availability contains open & close times

        if (!doctor || !doctor.availability) {
            throw new Error("Doctor or availability not found");
        }

        // Extract working hours
        const { openTime, endTime, pause } = doctor.availability; // Assuming availability has openTime, endTime & pause

        // Convert dates
        const workStart = new Date(`${workDate}T${openTime}:00.000Z`); // e.g., 2025-02-20T08:00:00.000Z
        const workEnd = new Date(`${workDate}T${endTime}:00.000Z`); // e.g., 2025-02-20T18:00:00.000Z

        // Optional pause time (assumed format: "HH:mm")
        let pauseStart = null;
        let pauseEnd = null;
        if (pause) {
            const [pauseStartHour, pauseStartMinute] = pause.start.split(':').map(Number);
            const [pauseEndHour, pauseEndMinute] = pause.end.split(':').map(Number);
            pauseStart = new Date(workStart);
            pauseStart.setHours(pauseStartHour, pauseStartMinute, 0, 0);
            pauseEnd = new Date(workStart);
            pauseEnd.setHours(pauseEndHour, pauseEndMinute, 0, 0);
        }

        // Generate time slots
        const timeSlots = [];
        let currentSlotStart = new Date(workStart);

        while (currentSlotStart < workEnd) {
            let currentSlotEnd = new Date(currentSlotStart);
            currentSlotEnd.setMinutes(currentSlotStart.getMinutes() + slotDuration);

            // Skip pause time
            if (pauseStart && pauseEnd && currentSlotStart >= pauseStart && currentSlotEnd <= pauseEnd) {
                currentSlotStart = new Date(pauseEnd);
                continue;
            }

            // Stop if it exceeds workEnd
            if (currentSlotEnd > workEnd) break;

            // Add the slot to the array
            timeSlots.push({
                startDate: new Date(currentSlotStart),
                endDate: new Date(currentSlotEnd),
                status: "pending",
            });

            // Move to next slot
            currentSlotStart = new Date(currentSlotEnd);
        }

        // Save time slots to database
        const savedSlots = await TimeSlot.insertMany(timeSlots);

        return savedSlots;
    } catch (error) {
        console.error("Error generating work time slots:", error);
        return [];
    }
};
/**
 * Filtre un objet en retirant les champs spécifiés dans un tableau.
 * @param {object} objectToFilter - L'objet Mongoose ou l'objet simple à filtrer.
 * @param {string[]} fieldsToRemove - Un tableau de chaînes de caractères représentant les clés à supprimer.
 * @returns {object} Un nouvel objet sans les champs spécifiés.
 */
const filterObjectFields = (objectToFilter, fieldsToRemove) => {
  // S'assurer que l'objet à filtrer est valide
  if (!objectToFilter || typeof objectToFilter !== 'object') {
    return {}; // Retourne un objet vide si l'entrée n'est pas un objet
  }

  // Convertit un document Mongoose en objet simple si nécessaire
  const plainObject = objectToFilter.toObject ? objectToFilter.toObject() : objectToFilter;

  // Crée une copie pour ne pas modifier l'objet original
  const filteredObject = { ...plainObject };

  // Boucle sur le tableau des champs à retirer et les supprime de la copie
  if (Array.isArray(fieldsToRemove)) {
    for (const field of fieldsToRemove) {
      delete filteredObject[field];
    }
  }

  return filteredObject;
};

module.exports = {
    handleErrorResponse,
    handleSuccessResponse,
    getEmailTemplate,
    generateWorkTimeSlots,
    filterObjectFields
};