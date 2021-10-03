const favoritesMod = require('../models/favoritesMod');


module.exports = {  
    
    getAllFavorites: (req,res) =>{
        favoritesMod.getAllFavorites(req.params.artistId)
        .then(favList => {
            res.status(200)
            .json(favList);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
        });
    },

    getFavorite: (req,res) =>{
        favoritesMod.getFavoriteById(req.params.artistId,req.params.songId)
        .then(favorite => {
            res.status(200)
            .json(favorite);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
            else if(err === false)
                res.status(404)
                .json({error: "favorite song not found" });
        });
    },

    addFavorite: (req,res) =>{
        favoritesMod.alreadyExistFav(req.params.artistId,req.body.songId)
        .then(succ =>{//if there is even one entry it means that this is duped
            res.status(409)
            .json({error: "favorite already exist" });
        })
        .catch(noEntry => {//else if there is no entry it proceeds to insert 
            if(noEntry === -1)
                res.status(500)
                .json({error: "internal error" });
            else
            {
                favoritesMod.addFavorite(req.params.artistId,req.body.songId)
                .then(newFavorite => {
                    res.status(200)
                    .json({msg:"favorite was added successfully"});
                })
                .catch(err => {
                    res.status(500)
                    .json({error: "internal error" });
                });
            }
        });
    },

    remFavorite: (req,res) =>{
        favoritesMod.remFavorite(req.params.artistId,req.params.songId)
        .then(newFavorite => {
            res.status(200)
            .json({msg:"favorite was removed successfully"});
        })
        .catch(err => {
            res.status(500)
            .json({error: "internal error" });
        });
    },
};