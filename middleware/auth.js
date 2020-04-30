const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]; 
		// on sait quelle forme a ce token : on récupère (avec split) 
		// la partie qui nous intéresse (après "Bearer")
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
		// si on a un userId dans la requête et s'il est différent	
			throw 'User ID non valable';
		} else {
			next();
		}

	} catch (error) {
		res.status(401).json({ error: error | 'Requête non authentifiée'});
	}
};