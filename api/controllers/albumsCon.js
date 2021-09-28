const albumsMod = require('../models/albumsMod');

module.exports = {  
    
    getAllAlbums: (req,res) =>{
        albumsMod.getAllAlbums(req.params.artistId)
        .then(albumList => {
            res.status(200)
            .json(albumList);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
        });
    },

    getAlbum: (req,res) =>{
        albumsMod.getAlbumById(req.params.artistId,req.params.albumId)
        .then(album=> {
            res.status(200)
            .json(album);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
            else if(err === false)
                res.status(404)
                .json({error: "album not found" });
        });
    },
    
    getSongsFromAlbum: (req,res) =>{
        albumsMod.getAllSongsFromAlbum(req.params.artistId,req.params.albumId)
        .then(songList => {
            res.status(200)
            .json(songList);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
        });
    },

    getSongFromAlbum: (req,res) =>{
        require("../models/songsMod").getSongById(req.params.artistId,req.params.songId)
        .then(song => {
            if(Number(song.albumId) === Number(req.params.albumId))
                res.status(200)
                .json(song);
            else
                res.status(404)
                .json({error: "song not found" });
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
            else if(err === false)
                res.status(404)
                .json({error: "song not found" });
        });
    },

};