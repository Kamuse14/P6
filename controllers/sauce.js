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
 Sauce.find() // ajouter const like = userLiked.length ?
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {
 Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
       switch (req.body.like) {
          case 1 : 
            if (!sauce.usersLiked.includes(req.body.userId )) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1},
                $push: { usersLiked: req.body.userId }
              })
                .then(sauce => res.status(200).json({ message: 'Sauce aimée'}))
                .catch(error => res.status(400).json({ error }));
            }
            break;

          case -1 :
            if (!sauce.usersDisliked.includes(req.body.userId )) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1},
                $push: { usersDisliked: req.body.userId }
              })
                .then(sauce => res.status(200).json({ message: 'Sauce détestée'}))
                .catch(error => res.status(400).json({ error }));
            }
            break;

          case 0 : 
            if (sauce.usersLiked.includes(req.body.userId )) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: -1},
                $pull: { usersLiked: req.body.userId }
              })
                .then(sauce => res.status(200).json({ message: 'Sauce indifférente'}))
                .catch(error => res.status(400).json({ error }));
            } else if(sauce.usersDisliked.includes(req.body.userId )) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: -1},
                $pull: { usersDisliked: req.body.userId }
              })
                .then(sauce => res.status(200).json({ message: 'Sauce indifférente'}))
                .catch(error => res.status(400).json({ error }));
            }
            break;
       }
    })
};

      
  


