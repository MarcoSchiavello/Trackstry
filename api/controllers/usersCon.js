const usersMod = require('../models/usersMod');

module.exports = {  
    login: (req,res) =>{
        usersMod.login(req.body.email,req.body.password)
        .then(token =>  {
            res.cookie("jwt",token,{ httpOnly: true }) 
            .json({token:token})
            .status(200);
        })
        .catch(err => {
            if(err === -1)
                res.status(500).json({error:"internal error"});
            else
                res.status(401).json({error:"email or password are wrong"});
        });
    },

    signup: (req,res) =>{
        usersMod.signup(req.body.username,req.body.email,req.body.password)
        .then(tokenPacket => {
            const fs = require('fs');
            const songsDir = "files/songs/"+tokenPacket.artId;
            const albumsImgDir = "files/icons/albums/"+tokenPacket.artId;
            const songsImgDir = "files/icons/songs/"+tokenPacket.artId;
            fs.mkdirSync(songsDir, { recursive: true });
            fs.mkdirSync(albumsImgDir, { recursive: true });
            fs.mkdirSync(songsImgDir, { recursive: true });

            res.cookie("jwt",tokenPacket.token,{ httpOnly: true })
            .json({token:tokenPacket.token})
            .status(200);
        })
        .catch(err => {
            if(err === 0 || err === 1)
                res.status(409).json({error:"username or email are taken"});
            else
                res.status(500).json({error:"server error"});
        });
        
    },

    logout: (req,res) =>{
        res.clearCookie("jwt");
        res.status(200).json({msg:"cookie successfully deleted"});
    },

    getArtist: (req,res) =>{
        usersMod.getUserById(req.params.artistId)
        .then(artistList => {
            res.status(200)
            .json(artistList);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
        });
    },

    getAllArtists: (req,res) =>{
        usersMod.getAllUser()
        .then(artistList => {
            res.status(200)
            .json(artistList);
        })
        .catch(err => {
            if(err === -1)
                res.status(500)
                .json({error: "internal error" });
        });
    }

};