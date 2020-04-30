//installer multer pour permettre le téléchargement d'images
const multer = require('multer'); 
// dictionnaire d'extensions
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

const storage = multer.diskStorage({ // on les enregistre sur le disque
	destination: (req, file, callback) => { // dans quel dossier
		callback(null, 'images')
	},
	filename: (req, file, callback) => { //quel nom de fichier
		const name =  file.originalname.split(' ').join('_'); // on génère un nv nom
		// à partir de l'original auquel on retire d'éventuels espaces
		// on génère l'extension du fichier
		const extension = MIME_TYPES[file.mimetype]; // correspond à celui envoyé par le frontend
		callback(null, name + Date.now() + '.' + extension);
		// Date.now = une time à la milliseconde pour le rendre unique
	} 
});

module.exports = multer({ storage }).single('image');
// on appelle la méthode multer  à laquelle on passe l'objet storage,
// on dit que le fichier est unique 