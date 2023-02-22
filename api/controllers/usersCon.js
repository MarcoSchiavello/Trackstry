const { EDESTADDRREQ } = require('constants');
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
    },

    changeArtist: (req,res) =>{
        const fs = require('fs');
        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(req.files.newImg !== undefined) {
            fs.rename(req.files.newImg[0].path, "files/icons/profiles/"+req.files.newImg[0].filename, err => { if (err) throw err });
            req.body.newImg = "/files/icons/profiles/"+req.files.newImg[0].filename;
        }

        if(req.files.newBanner !== undefined) {
            req.body.newBanner = req.files.newBanner[0].path;
            req.body.newBanner = "/"+req.body.newBanner.replace(/\\/g,"/");
        }
        if(req.body.newEmail !== undefined) {
            if(!regexEmail.test(String(req.body.newEmail).toLowerCase())) {
                //422 stans for Unprocessable Entity for more info look at: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                
                return res.status(422) 
                .json({err:"invalid email"});
            }
        }
        usersMod.changeArtist(req.params.artistId,req.body)
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