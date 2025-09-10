class BaseService {
    constructor(model) {
        if (!model) {
            throw new Error("Model is required for BaseService");
        }
        this.model = model;
    }

    async getById(id) {
        try {
            const record = await this.model.findById(id);
            if (!record) {
                throw new Error(`${this.model.modelName} not found`);
            }
            return record;
        } catch (error) {
            console.error(`[BaseService:getById] Error: ${error.message}`);
            throw new Error(`Error fetching ${this.model.modelName}`);
        }
    }

    async create(data) {
        try {
            const newRecord = new this.model(data);
            const savedRecord = await newRecord.save();
            return savedRecord;
        } catch (error) {
            console.error(`[BaseService:create] Error: ${error.message}`);
            throw new Error(`Error creating ${this.model.modelName}`);
        }
    }

    async updateById(id, updates) {
        try {
            const updatedRecord = await this.model.findByIdAndUpdate(id, updates, { new: true });
            return updatedRecord;
        } catch (error) {
            console.error(`[BaseService:updateById] Error: ${error.message}`);
            throw new Error(`Error updating ${this.model.modelName}`);
        }
    }

    async deleteById(id) {
        try {
            const deletedRecord = await this.model.findByIdAndDelete(id);
            return deletedRecord;
        } catch (error) {
            console.error(`[BaseService:deleteById] Error: ${error.message}`);
            throw new Error(`Error deleting ${this.model.modelName}`);
        }
    }
}

module.exports = BaseService;