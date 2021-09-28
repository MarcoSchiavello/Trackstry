module.exports = (app) => {
    app.get('/', (req,res) => { res.render('index') });
    app.get('/artisti', (req,res) =>{ res.render('artisti') });
    app.get('/login',(req,res) =>{ res.render('login') });
    app.get('/signup',(req,res) =>{ res.render('signup') });
    app.get('/artista', (req,res) =>{ res.render('artista'); });
    app.get('/player', (req,res) =>{ res.render('player'); });
    
    //proctetced routes
    checkUser = (req,res,next) =>{
        /*import fetch from 'node-fetch';
        requestedId = req.params.artId;
        fetch("http://localhost:4000/v1/auth/isLoggedIn",{method: 'GET',credentials: 'include'})
        .then(res => res.json())
        .then(artist => {
            console.log(artist,requestedId);
            if(artist.artId !== requestedId)
                res.status(401);
            else
                
        })*/
        next();
    };
    app.get('/mia_musica/:artId',checkUser, (req,res) =>{ res.render('yourMusic'); });
    app.get('/preferiti/:artId',checkUser, (req,res) =>{ res.render('preferiti'); });
    app.get('/profilo/:artId',checkUser, (req,res) =>{ res.render('profile'); });
    app.get('/uploadAlbum/:artId',checkUser, (req,res) =>{ res.render('upload_alb'); });
    app.get('/uploadSong/:artId',checkUser, (req,res) =>{ res.render('upload_song'); });

}