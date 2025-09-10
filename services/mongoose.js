

const mongoose = require('mongoose');
const config = require('../config');
const dbUrl = config.dbUrlMongoDB;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Il est bon d'ajouter un timeout pour la sélection du serveur,
      // pour que l'échec soit plus rapide si la DB n'est pas joignable.
      serverSelectionTimeoutMS: 5000 
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    // Si la connexion échoue, on arrête le processus de l'application. C'est crucial.
    process.exit(1);
  }
};

// ... le reste du fichier (process.on('SIGINT', ...)) est correct

module.exports = connectDB;