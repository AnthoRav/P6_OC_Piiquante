const Sauce = require('../models/Sauce');
const fs = require('fs');

//Fonction pour la création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de l'id et userId pour utiliser le token à la place
  delete sauceObject._id;
  delete sauceObject._userId;
  //Création de l'objet sauce en utilisant les données indiquées 
  const sauce = new Sauce({
      ...sauceObject,
      //et userId de la requête dans le token
      userId: req.auth.userId,
      //génération de l'url de l'image fournie
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //Enregistrement dans la base de donnée
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//Fonction pour afficher une seule sauce de la bdd correspondant à l'id de la requête
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(404).json({ error: error })});
};

//Fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    //Vérification s'il y a une image dans la modification
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;

  //if (req.file) {
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          
          //Vérification de l'userId, seul le créateur de la sauce pour la modifier
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({ message : 'Unauthorized request'});
            } else {
                //Suppression de l'ancienne image
                //if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                //}
                //Mise à jour de la sauce avec les nouvelles entrées
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Objet modifié!'}))
                    .catch(error => res.status(401).json({ error }));
            });
            }
        })
        .catch((error) => {res.status(400).json({ error })});
    };
//}

//Fonction pour la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        //Verification de l'userId, seul le créateur de la sauce pour la supprimer
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({message: 'Unauthorized request'});
          } else {
            //Suppression de l'image
          const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                //Suppression de la sauce
                Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
            }
      })
      .catch( error => {res.status(500).json({ error })});
};

//Fonction pour afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces)
		})
		.catch((error) => {
			res.status(400).json({ error: error })
		})
};