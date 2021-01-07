const BodyPar = require('body-parser');

module.exports = (app) => {
    app.get('/', (req,res) =>{
        res.end('Ciao Mondo');
    });
}