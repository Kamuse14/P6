const Sauce = require('../models/Sauce');
const fs = require('fs'); //fs: filesystem

// création de la sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
	const sauce = new Sauce({
	    ...sauceObject, 
	    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
  });
	// enregistre l'objet dans la bd et retourne une promesse
  sauce.save() 
	  .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))  
	  .catch(error => res.status(400).json({ error }));
};

// modification de la sauce (si l'utilisateur en est la créateur)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? 
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(sauce => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({ error })); 
};

// suppression de la sauce (si l'utilisateur en est la créateur)
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

// lecture d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error })); // 404 (objet non trouvé)
};

// lecture de toutes les sauces
exports.getAllSauces = (req, res, next) => { 
 Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// choix de l'utilisateur
exports.likeSauce = (req, res, next) => {
 Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
       switch (req.body.like) {
          // l'utilisateur aime la sauce
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

          // l'utilisateur n'aime pas la sauce
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

          // l'utilisateur annule son choix
          case 0 : 
            if (sauce.usersLiked.includes(req.body.userId)) {
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

      
  


