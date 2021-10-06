const songsMod = require('../models/songsMod');

module.exports = {  
    
    getAllSongs: (req,res) =>{
        songsMod.getAllSongs(req.params.artistId)
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

    getSong: (req,res) =>{
        songsMod.getSongById(req.params.artistId,req.params.songId)
        .then(song => {
            res.status(200)
            .json(song);
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

    addSong: (req,res) =>{
        
        let songImgPath = "/files/icons/songs/default/default.png";
        if(req.files.songImg !== undefined)
            songImgPath = req.files.songImg[0].destination.replace(".","")+"/"+req.files.songImg[0].filename;
        const songPath = req.files.song[0].destination.replace(".","")+"/"+req.files.song[0].filename;
        songsMod.addSong(req.user.id,{
            songAudio: songPath,
            songImg: songImgPath,
            songDuration: Number(req.body.songDuration),
            songName: req.body.songName,
            albumId: req.body.albumId
        })
        .then(newSongId => {
            res.status(200)
            .json({msg:"song was added successfully",songId: newSongId});
        })
        .catch(err =>{
            res.status(500)
            .json({error:"error while adding the new song"});
        })
    },

    remSong: (req,res) =>{
        songsMod.remSong(req.user.id,req.params.songId)
        .then(succ => {
            res.status(200)
            .json({msg:"song was removed successfully"});
        })
        .catch(err =>{
            res.status(500)
            .json({error:"error while removing the new song"});
        })
    },
};