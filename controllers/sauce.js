const Sauce = require('../models/Sauce');
const fs = require('fs'); //fs: firesystem

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
 
  delete sauceObject._id;
	const sauce = new Sauce({
	    ...sauceObject, // raccourci pour récupérer tout le contenu du schéma Sauce
	    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
 // http://localhost:3000/images/"nom du fichier image"
  });
	sauce.save() // enregistre l'objet dans la bd et retourne une promesse
	  .then(() => res.status(201).json({ message: 'Sauce enregistrée'})) // 201: création réussie 
	  .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // opérateur ternaire (s'il existe ou non)
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(sauce => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({ error })); 
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error })); // 404: objet non trouvé
};

exports.getAllSauces = (req, res, next) => { 
 Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


// exports.likeSauce = (req, res, next) => {
//   // const sauceObject = JSON.parse(req.body.sauce);
//   Sauce.like({ usersLiked: req.body.usersLiked})
//    .then( usersLiked => {
//      if (usersLiked == userId) {
//        return res.status(400).json({ error: 'Avis déjà donné'});
//      }
//      likes.save()  //usersLiked.push(userId);
//        .then(() => res.status(201).json({ message: "J'aime cette sauce !"})) 
//        .catch(error => res.status(400).json({ error }));
//     })
//    .catch(error => res.status(500).json({ error }));
// };

// exports.dislikeSauce = (req, res, next) => {
//   Sauce.like({ usersDisliked: req.body.usersDisliked})
//    .then( usersDisliked => {
//      if (usersDisliked == userId) {
//        return res.status(400).json({ error: 'Avis déjà donné'});
//      }
//      dislikes.save() 
//        .then(() => res.status(201).json({ message: "Je n'aime pas cette sauce !"})) 
//        .catch(error => res.status(400).json({ error }));
//     })
//    .catch(error => res.status(500).json({ error }));
// };



// ou bien une seule route avec un switch/case/break ?
// Vérifier que la sauce n'est pas déjà aimée ou détestée :
// 
// 
// exports.likeSauce() {
//  const like === 0;
//  switch (like) {
//    case '1':
//      for (let i= 0, i<userLiked.length, i++) {
//        if(i != userId) {
//          usersLiked.push(userId);
//        }
//      }
//      break;
//    case '-1':
//       for (let i= 0, i<userDisliked.length, i++) {
//        if(i != userId) {
//          usersDisliked.push(userId);
//        }
//       }
//       break;
//    default:
//       like === 0;
//       for (let i= 0, i<userLiked.length, i++) {
//        if(userId) {
//          usersLiked.splice(i, 1);
//        }
//       }
//       for (let i= 0, i<userDisliked.length, i++) {
//        if(i != userId) {
//          usersDisliked.splice(i, 1);
//        }
//       }
//   }
// }