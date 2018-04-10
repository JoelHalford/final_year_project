/* ===================
   Import Node Modules
=================== */
const express = require('express'); //web framework for node
const multer = require('multer'); //used for image saving
const app = express(); //initialise express app
const router = express.Router(); //initialise router through express
const mongoose = require('mongoose'); //schema for MongoDB
const config = require('./config/database'); //config for mongoose
const path = require('path'); //package for filepaths
const auth = require('./routes/auth')(router);//initialise authentication router
const products = require('./routes/products')(router);//initialise products router
const dashboard = require('./routes/dashboard')(router);//initialise products router
const bodyParser =require('body-parser');
const cors = require('cors');//enables cross-platform communication between frontend and backend
var port = process.env.PORT || 3000;

// Database Connection
mongoose.Promise = global.Promise;//uses native promises
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log("Couldn't connect to DB: ", err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

app.use(cors({
	origin: 'http://localhost:4200'
}));

//body-parsing middleware
app.use(bodyParser.urlencoded({extended: true}));
//parse json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
//provides static directory for frontend
app.use(express.static(__dirname + '/public'));
app.use('/auth', auth);
app.use('/product', products);
app.use('/dashboard', dashboard);

//connects server to angular2 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Start Server: Listen on port
app.listen(port, () => {
  console.log('Listening on port: ' + port);
});

module.exports = app;