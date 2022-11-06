require('dotenv').config();
const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        //Récupération du token d'authentification dans le header authorization
       const token = req.headers.authorization.split(' ')[1];
       //Décodage du token
       const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
       //Récupération de l'userId encodé dans le token
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};