const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); // donne le chemin du fichier
const env = require('dotenv');
env.config();
const helmet = require('helmet');


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/**
 * connexion à la base de données
 * @type {Object}
 */
mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0-q8tcw.mongodb.net/piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
mongoose.set('useCreateIndex', true);

// possibilité de "connexion" des deux localhost 3000 et 4200
app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json()); 

// protection contre les attaques par injection
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
	directives:  {
		defaultSrc: ["'self'"]
	}
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

// définition des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;