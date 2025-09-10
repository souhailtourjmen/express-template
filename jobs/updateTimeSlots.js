const cron = require('node-cron');
const TimeSlot = require('../src/timeSlot/models');

// Tâche exécutée toutes les heures
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();

        const result = await TimeSlot.updateMany(
            { endDate: { $lt: now }, status: "pending" },
            { $set: { status: "absent" } }
        );

        console.log(`[${new Date().toISOString()}] Mise à jour des TimeSlots :`, result.modifiedCount);
    } catch (error) {
        console.error('Erreur lors de la mise à jour des TimeSlots :', error);
    }
});
