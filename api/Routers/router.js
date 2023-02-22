const usersCon = require('../controllers/usersCon');
const songsCon = require('../controllers/songsCon');
const albumsCon = require('../controllers/albumsCon');
const favoritesCon = require('../controllers/favoritesCon');
const Uploads = require("../config/multerUpload");
const passport = require("passport");
require('../config/passport');


module.exports = (app) => {
    //auth
    app.get('/v1/auth/isLoggedIn',passport.authenticate("jwt",{ session: false }),(req,res) => res.status(200).json(req.user) );
    app.post('/v1/auth/login',usersCon.login);
    app.post('/v1/auth/signup',usersCon.signup);
    app.post('/v1/auth/logout',usersCon.logout);

    //artist/user
    app.get('/v1/artists',usersCon.getAllArtists);
    app.get('/v1/artists/:artistId',usersCon.getArtist);
    app.patch('/v1/artists/:artistId',
    Uploads.uploadArtist.fields([{ name: 'newImg', maxCount: 1 }, { name: 'newBanner', maxCount: 1 }]),
    passport.authenticate("jwt",{ session: false }),
    usersCon.changeArtist);

    //songs
    app.get('/v1/artists/:artistId/songs',songsCon.getAllSongs);
    app.get('/v1/artists/:artistId/songs/:songId',songsCon.getSong);
    app.post('/v1/artists/:artistId/songs',
    passport.authenticate("jwt",{ session: false }),
    Uploads.uploadSong.fields([{ name: 'songImg', maxCount: 1 }, { name: 'song', maxCount: 1 }]),
    songsCon.addSong);
    app.delete('/v1/artists/:artistId/songs/:songId',passport.authenticate("jwt",{ session: false }),songsCon.remSong);

    //album
    app.get('/v1/artists/:artistId/albums',albumsCon.getAllAlbums);
    app.get('/v1/artists/:artistId/albums/:albumId',albumsCon.getAlbum);
    app.get('/v1/artists/:artistId/albums/:albumId/songs',albumsCon.getSongsFromAlbum);
    app.get('/v1/artists/:artistId/albums/:albumId/songs/:songId',albumsCon.getSongFromAlbum);
    app.post('/v1/artists/:artistId/albums',
    passport.authenticate("jwt",{ session: false }),
    Uploads.uploadAlbum.fields([{ name: 'albumImg', maxCount: 1 }]),
    albumsCon.addAlbum);
    app.delete('/v1/artists/:artistId/albums/:albumId',passport.authenticate("jwt",{ session: false }),albumsCon.remAlbum);

    //favorite
    app.get('/v1/artists/:artistId/favorites',passport.authenticate("jwt",{ session: false }),favoritesCon.getAllFavorites);
    app.get('/v1/artists/:artistId/favorites/:songId',passport.authenticate("jwt",{ session: false }),favoritesCon.getFavorite);
    app.post('/v1/artists/:artistId/favorites',passport.authenticate("jwt",{ session: false }),favoritesCon.addFavorite);
    app.delete('/v1/artists/:artistId/favorites/:songId',passport.authenticate("jwt",{ session: false }),favoritesCon.remFavorite);

    
}
