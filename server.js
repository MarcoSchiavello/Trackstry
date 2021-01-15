const Express = require('express');
const MainCon = require('./Controllers/MainCon');

var app = Express();

app.set('view engine', 'ejs');   
app.use('/assets',Express.static("assets"));

MainCon(app);

app.listen(3000);