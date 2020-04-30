// package de cryptage pour les mdp :  npm install --save bcrypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Création de nouveaux Users dans la db à partir de la connexion de l'inscription 
const User = require('../models/User'); //enregistrer et lire


exports.signup = (req, res, next) => { //on hash le mdp en async
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				email: req.body.email, // adresse dans le corps de la requête
				password: hash //mdp crypté
			});
			user.save() //pour enregistrer ds la db
				.then(() => res.status(201).json({ message: 'Utilisateur créé'}))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then(user => { // on vérifie si l'U existe déjà
			if (!user) {
				return res.status(401).json({ error: 'Utilisateur non trouvé'});
			}
			// on compare le mdp hashé et celui rentré par l'U
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({ error: 'Mot de passe incorrect'});
					}
					res.status(200).json({
						userId: user._id, 
						token: jwt.sign(
							{ userId: user._id },
							'RANDOM_TOKEN_SECRET', // clé secrète pour l'encodage (à modifier ?)
							{ expiresIn: '24h'}  // argument de configuration (expiration)
						)
					});
				})
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};