// Fichier : index.js

// 1. Importer les modules nécessaires
const http = require('http');
const app = require('./app'); // L'application Express configurée
const connectDB = require('./services/mongoose'); // La fonction de connexion
const config = require('./config');
require('dotenv').config();
require('./jobs/updateTimeSlots');

// 2. Créer une fonction de démarrage `async`
const startServer = async () => {
    try {
        // 2a. Attendre que la connexion à MongoDB soit établie avec succès
        await connectDB();

        // 2b. Une fois la connexion réussie, procéder au démarrage du serveur HTTP
        const normalizePort = val => {
            const port = parseInt(val, 10);
            if (isNaN(port)) return val;
            if (port >= 0) return port;
            return false;
        };

        const PORT = process.env.PORT || config.port;
        const port = normalizePort(PORT);
        app.set('port', port);

        const errorHandler = error => {
            if (error.syscall !== 'listen') throw error;
            const address = server.address();
            const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges.');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use.');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        };

        const server = http.createServer(app);

        server.on('error', errorHandler);
        server.on('listening', () => {
            const address = server.address();
            const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
            console.log('Listening on ' + bind + '\nNODE_ENV on: ' + process.env.NODE_ENV);
        });

        server.listen(port);

    } catch (error) {
        // Cette erreur est attrapée si `connectDB` lance une exception
        // (par exemple si nous modifions connectDB pour qu'il le fasse)
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// 3. Appeler la fonction de démarrage
startServer();