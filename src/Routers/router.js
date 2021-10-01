module.exports = (app) => {
    app.get('/', (req,res) => { res.render('index') });
    app.get('/artisti', (req,res) =>{ res.render('artisti') });
    app.get('/login',(req,res) =>{ res.render('login') });
    app.get('/signup',(req,res) =>{ res.render('signup') });
    app.get('/artista/:artId', (req,res) =>{ res.render('artista'); });
    app.get('/player', (req,res) =>{ res.render('player'); });
    
    //proctetced routes
    app.get('/mia_musica/:artId', (req,res) =>{ res.render('yourMusic'); });
    app.get('/preferiti/:artId', (req,res) =>{ res.render('preferiti'); });
    app.get('/profilo/:artId', (req,res) =>{ res.render('profile'); });
    app.get('/uploadAlbum/:artId', (req,res) =>{ res.render('upload_alb'); });
    app.get('/uploadSong/:artId', (req,res) =>{ res.render('upload_song'); });

}