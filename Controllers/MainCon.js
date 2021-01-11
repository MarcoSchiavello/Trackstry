const BodyPar = require('body-parser');
const Express = require('express');
module.exports = (app) => {
    app.use('/assets',Express.static("assets"));
    app.get('/', (req,res) =>{
        res.render('index');
    });
}