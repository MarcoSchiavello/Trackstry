const Express = require('express');
const MainCon = require('./Controllers/MainCon');

var app = Express();

app.set('view engine', 'ejs');

MainCon(app);

app.listen(3000);