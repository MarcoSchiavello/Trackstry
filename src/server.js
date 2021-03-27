const Express = require('express');
const MainRouter = require('./Router/MainRouter');

var app = Express();

app.set('view engine', 'ejs');   
app.use('/assets',Express.static("assets"));

MainRouter(app);

app.listen(3000);