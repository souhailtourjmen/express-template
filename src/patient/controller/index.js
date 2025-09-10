const PatientService = require("../services/index");

class PatientController {
    /**
     * Get a patient by ID
     * @param {Request} req
     * @param {Response} res
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await PatientService.getById(id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error(`[getById] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }

    /**
     * Create a new patient
     * @param {Request} req
     * @param {Response} res
     */
    static async create(res, parameters) {
            try {
                const result = await PatientService.create(parameters);
                return res.status(result.status).json(result);
            } catch (error) {
                console.error(`[create] Error: ${error.message}`);
                return res.status(500).json({ message: "Server error" });
            }
        }
        /**
         * Create a new patient
         * @param {Request} req
         * @param {Response} res
         */
    static async createGuestPatient(res, parameters) {
        try {
            const result = await PatientService.createGuestPatient(parameters);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(`[create] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }

    /**
     * Update patient information
     * @param {Request} req
     * @param {Response} res
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const patientFound = await PatientService.getById(id);
            if (!patientFound.success) {
                return res.status(patientFound.statusCode).json(patientFound);
            }

            const result = await PatientService.updateInfo(req.body, patientFound.data);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error(`[update] Error: ${error.message}`);
            return res.status(500).json({ message: "Server error" });
        }
    }


}

module.exports = PatientController;