const Express = require('express');
const MainRouter = require('./Router/MainRouter');
const Session = require('express-session');

var app = Express();

app.set('view engine', 'ejs');   
app.use('/assets',Express.static("assets"));
app.use(Session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

MainRouter(app);

app.listen(3000);