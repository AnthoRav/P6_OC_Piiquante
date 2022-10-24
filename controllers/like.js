const Sauce = require('../models/Sauce');


exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        // Si l'utilisateur n'a pas encore aimé ou non une sauce
        if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
                if(req.body.like == 1) { // L'utilisateur aime la sauce
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes += req.body.like;
                } else if(req.body.like == -1) { // L'utilisateur n'aime pas la sauce
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

    /*
    exports.likeSauce = (req, res, next) => {
        Sauce.findOne({_id : req.params.id})
            .then((sauce) => {
                //like = 1
                //si le usersliked est False ET si like === 1
                if(!sauce.usersLiked.includes(req.body.userId) && req.body.likes === 1) {
                    //mise a jour sauce BDD
                    Sauce.updateOne(
                        {_id : req.params.id},
                        {
                            $inc: {likes: 1},
                            $push: {usersLiked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce like +1"}))
                    .catch((error) => res.status(400).json({ error }));
                };
            
    
                //like = 0
                if(sauce.usersLiked.includes(req.body.userId) && req.body.likes === 0) {
                    //mise a jour sauce BDD
                    Sauce.updateOne(
                        //chercher objet dans la bdd
                        {_id : req.params.id},
                        {
                            $inc: {likes: -1},
                            $pull: {usersLiked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce like 0"}))
                    .catch((error) => res.status(400).json({ error }));
                };
    
                //dislike = +1 (like = -1)
                if(!sauce.usersDisLiked.includes(req.body.userId) && req.body.likes === -1) {
                    //mise a jour sauce BDD
                    Sauce.updateOne(
                        {_id : req.params.id},
                        {
                            $inc: {dislikes: +1},
                            $push: {usersDisLiked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce dislike +1"}))
                    .catch((error) => res.status(400).json({ error }));
                };
    
                //Après un like = -1 on met un like = 0 (on enlève le dislike)
                if(sauce.usersDisLiked.includes(req.body.userId) && req.body.likes === 0) {
                    //mise a jour sauce BDD
                    Sauce.updateOne(
                        //chercher objet dans la bdd
                        {_id : req.params.id},
                        {
                            $inc: {dislikes: -1},
                            $pull: {usersDisLiked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce dislike 0"}))
                    .catch((error) => res.status(400).json({ error }));
                };
    
            })
    
            .catch(error => res.status(500).json({ error }));
    
    };
    */