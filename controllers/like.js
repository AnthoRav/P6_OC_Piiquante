const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        switch (req.body.like) {
          // Like = 1 => L'utilisateur aime la sauce (like = +1)
          case 1:
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
              //   "Le 'userId' n'est pas contenu dans 'usersLiked' et le 'userId aime la sauce"
              // Mise à jour de la sauce dans la base de données
              Sauce.updateOne(
                { _id: req.params.id },
                // Incrémentation du champ 'like' à '1' dans la base de données
                // Ajout du 'userId' dans le champ 'usersLiked' dans la base de données
                { 
                $inc: { likes: 1 }, 
                $push: { usersLiked: req.body.userId } 
                }
              )
                .then(() => {res.status(201).json({ message: "La sauce a été likée !" })})
                .catch((error) => {res.status(400).json({ error })});
            }
            break;
  
          // Like = -1 => dislike = +1
          case -1:
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
              //"Le 'userId' n'est pas contenu dans 'usersDisliked' et le 'userId' n'aime pas la sauce"
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: 1 },
                  $push: { usersDisliked: req.body.userId },
                }
              )
                .then( () => {res.status(201).json({ message: "La sauce a été dislikée !" })})
                .catch((error) => {res.status(400).json({ error })});
            }
            break;
  
          case 0:
            // Like = 0  => L'utilisateur annule son like (like = 0)
            // Si le 'userId' est contenu dans 'usersLiked' et que le 'userId' annule son vote
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: req.body.userId },
                }
              )
                .then(() => {res.status(201).json({ message: "Le like a été annulé !" })})
                .catch((error) => {res.status(400).json({ error })});
            }
            if (sauce.usersDisliked.includes(req.body.userId)) {
              // Like = 0  => L'utilisateur annule son dislike (dislike = 0)
              // Si le 'userId' est contenu dans 'usersDisliked' et que le 'userId' annule son vote
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: -1 },
                  $pull: { usersDisliked: req.body.userId },
                }
              )
                .then(() => {res.status(201).json({ message: "Le dislike a été annulé !" })})
                .catch((error) => {res.status(400).json({ error })});
            }
            break;
        }
      })
      .catch((error) => {res.status(404).json({ error })});
  };