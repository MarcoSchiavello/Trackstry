//const BodyPar = require('body-parser');
const Express = require('express');
const MainMod = require('../Model/MainMod');

module.exports = {
    root: async (req,res) =>{
        req.session.name = "marco";
        res.render('index',{sess : req.session});
    }
};