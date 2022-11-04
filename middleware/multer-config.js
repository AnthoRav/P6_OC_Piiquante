const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Configuration de multer
const storage = multer.diskStorage({
  //Destination des fichiers images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //Création du nom des fichiers images
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');//Remplacement des espaces par underscore
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');