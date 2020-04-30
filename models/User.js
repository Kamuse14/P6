const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// on ajoute ce validateur comme plugin à ce schéma

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true }, 
	// unique = on ne pourra pas s'enregistrer 2x avec le m^ email
	// pour être bien lu, il faut rajouter un package à Mongoose :
	// npm install --save mongoose-unique-validator
	password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
//ce validateur, on l'applique au schéma AVANT d'en faire un modèle
module.exports = mongoose.model('User', userSchema); 
// export schema sous forme de modèle