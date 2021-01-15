const BodyPar = require('body-parser');
const Express = require('express');

module.exports = (app) => {

    app.get('/', (req,res) =>{
        res.render('index');
    });
    app.get('/canzoni', (req,res) =>{
        res.render('canzoni');
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
}