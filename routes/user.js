const express = require('express'); //pour créer un routeur
const router = express.Router();
const userCtrl = require('../controllers/user'); // création du controlleur pour l'associer aux différentes routes

const bouncer = require("express-bouncer")(1000, 900000, 2); // contre-attaque bruteforce
bouncer.blocked = (req, res, next, remaining) => {
	res.status(429).send ("Too many requests have been made, " +
		"please wait " + remaining / 1000 + " seconds");
};

// On crée 2 routes POST
router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login); 

module.exports = router; // on exporte ce routeur