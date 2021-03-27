//const BodyPar = require('body-parser');
const Express = require('express');
const MainMod = require('../Model/MainMod');

module.exports = {
    root: async (req,res) =>{
        res.render('index');
    }
};