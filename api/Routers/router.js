const usersCon = require('../controllers/usersCon');
const songsCon = require('../controllers/songsCon');
const albumsCon = require('../controllers/albumsCon');
const favoritesCon = require('../controllers/favoritesCon');
const multer = require("multer");
const passport = require("passport");
require('../config/passport');

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        const mimetype = file.mimetype.split("/")[0];
        if(mimetype === "audio")
            cb(null,"./files/songs/"+req.user.artist_id);
        else if(mimetype === "image")
            cb(null,"./files/icons/songs/"+req.user.artist_id);
    },
    filename: (req,file,cb) =>{
        const crypto = require("crypto");
        let extention = file.originalname.split(".");
        extention = extention[extention.length-1];
        cb(null,crypto.randomBytes(20).toString("hex")+"."+extention);
    }
});
const upload = multer({storage: storage});


module.exports = (app) => {
    //auth
    app.get('/v1/auth/isLoggedIn',passport.authenticate("jwt",{ session: false }),(req,res) =>{ res.status(200).json({artId: req.user.artist_id}); });
    app.post('/v1/auth/login',usersCon.login);
    app.post('/v1/auth/signup',usersCon.signup);
    app.post('/v1/logout',passport.authenticate("jwt",{ session: false }),usersCon.logout);

    //artist/user
    app.get('/v1/artists',usersCon.getAllArtists);
    app.get('/v1/artists/:artistId',usersCon.getArtist);

    //songs
    app.get('/v1/artists/:artistId/songs',songsCon.getAllSongs);
    app.get('/v1/artists/:artistId/songs/:songId',songsCon.getSong);
    app.post('/v1/artists/:artistId/songs',passport.authenticate("jwt",{ session: false }),upload.fields([{ name: 'songImg', maxCount: 1 }, { name: 'song', maxCount: 1 }]),songsCon.addSong);

    //album
    app.get('/v1/artists/:artistId/albums',albumsCon.getAllAlbums);
    app.get('/v1/artists/:artistId/albums/:albumId',albumsCon.getAlbum);
    app.get('/v1/artists/:artistId/albums/:albumId/songs',albumsCon.getSongsFromAlbum);
    app.get('/v1/artists/:artistId/albums/:albumId/songs/:songId',albumsCon.getSongFromAlbum);
    app.post('/v1/artists/:artistId/albums',passport.authenticate("jwt",{ session: false }),upload.fields([{ name: 'albumImg', maxCount: 1 }]),albumsCon.addAlbum);

    //favorite
    app.get('/v1/artists/:artistId/favorites',passport.authenticate("jwt",{ session: false }),favoritesCon.getAllFavorites);
    app.get('/v1/artists/:artistId/favorites/:favoriteId',passport.authenticate("jwt",{ session: false }),favoritesCon.getFavorite);

    
}
