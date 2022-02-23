const express = require('express');
const router = require('./Routers/router.js');

var app = express();

app.set('view engine', 'ejs');   
app.use('/assets',express.static("assets"));
app.use('/config.json',express.static("config.json"));

router(app);

app.listen(3000);