require('dotenv').config();// module that puts all key-value pairs present in the .env file in the process.env 
const express = require('express');
const router = require('./Routers/router');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");

var app = express();

app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/files',express.static("files"));

router(app);

app.listen(process.env.PORT);