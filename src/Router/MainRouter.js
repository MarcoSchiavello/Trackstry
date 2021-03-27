const MainCon = require('../Controllers/MainCon');

module.exports = (app) => {

    app.get('/',MainCon.root);
    
    app.get('/artisti', (req,res) =>{
        res.render('artisti');
    });
    app.get('/login', (req,res) =>{
        res.render('login');
    });
    app.get('/signup', (req,res) =>{
        res.render('signup');
    });
    app.get('/artista', (req,res) =>{
        res.render('artista');
    });
    app.get('/mia_musica', (req,res) =>{
        res.render('yourMusic');
    });
    app.get('/preferiti', (req,res) =>{
        res.render('preferiti');
    });
    app.get('/profilo', (req,res) =>{
        res.render('profile');
    });
    app.get('/uploadAlbum', (req,res) =>{
        res.render('upload_alb');
    });
    app.get('/uploadSong', (req,res) =>{
        res.render('upload_song');
    });
    app.get('/player', (req,res) =>{
        res.render('player');
    });
}