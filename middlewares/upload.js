// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Notre config Cloudinary

// Configurer le stockage pour Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profils_utilisateurs', // Le nom du dossier sur Cloudinary
        eager: [
            {
                fetch_format: 'webp', // Forcer le format WebP
                quality: 'auto',      // Laisser Cloudinary choisir la meilleure qualité/compression
                width: 500,           // Optionnel : redimensionner en même temps
                height: 500,
                crop: 'limit'
            }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png'], // Formats autorisés
        // transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optionnel: pour redimensionner les images
    },
});

// Créer le middleware d'upload avec Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limite de 5 MB par fichier
    },
    fileFilter: (req, file, cb) => {
        // Vérifier si le type de fichier est autorisé
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non supporté. Uniquement JPG, JPEG et PNG.'), false);
        }
    },
});

module.exports = upload;