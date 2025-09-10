const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file to Cloudinary.
 * @param {string} filePath - The path to the file to upload.
 * @param {string} folder - The folder in Cloudinary to store the file.
 * @returns {Promise<object>} - The upload result from Cloudinary.
 */
const uploadFile = async (filePath, folder = 'default_folder') => {
  if (!filePath) {
    throw new Error('File path is required for uploading.');
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    return result;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFile
};