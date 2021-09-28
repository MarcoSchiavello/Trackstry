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
        favoritesMod.getFavoriteById(req.params.artistId,req.params.favoriteId)
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
};