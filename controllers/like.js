const Sauce = require('../models/Sauce');

//Fonction pour la gestion des like et dislike
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        // Si l'utilisateur n'a pas encore aimé ou non une sauce
        if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
                // L'utilisateur aime la sauce
                if(req.body.like == 1) { 
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += req.body.like;

                } 
                // L'utilisateur n'aime pas la sauce
                else if(req.body.like == -1) { 
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes -= req.body.like;
                };
            };
            // Si l'utilisateur veut annuler son "like"
            if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
                sauce.usersLiked.splice(likesUserIndex, 1);
                sauce.likes -= 1;
            };
            // Si l'utilisateur veut annuler son "dislike"
            if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
                const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
                sauce.usersDisliked.splice(likesUserIndex, 1);
                sauce.dislikes -= 1;
            }
            sauce.save();
            res.status(201).json({ message: 'Like / Dislike mis à jour' });
        })
        .catch(error => res.status(500).json({ error }));
    };

    