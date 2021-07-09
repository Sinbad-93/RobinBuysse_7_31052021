//module pour autoriser et controller le téléchargement d'image
const multer = require("multer");
/*GESTION DES IMAGES*/

// formats acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};
// taille maximum
const maxSize = 1* 1000 * 1000;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  
  filename: (req, file, callback) => {
    console.log(file);
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },

  limits: {fileSize: maxSize }
});

module.exports = multer({ storage: storage }).single("image");
