const express = require('express'); //pour créer un routeur
const router = express.Router();
const userCtrl = require('../controllers/user'); // création du controlleur pour l'associer aux différentes routes

// On crée 2 routes POST
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // on exporte ce routeur