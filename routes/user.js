// création d'un routeur
const express = require('express'); 
const router = express.Router();
// création du controlleur pour l'associer aux différentes routes
const userCtrl = require('../controllers/user'); 

// contre-attaque bruteforce
const bouncer = require("express-bouncer")(1000, 900000, 2); 
bouncer.blocked = (req, res, next, remaining) => {
	res.status(429).send ("Too many requests have been made, " +
		"please wait " + remaining / 1000 + " seconds");
};

// création de 2 routes POST
router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login); 

module.exports = router;