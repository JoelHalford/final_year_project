/* ===================
   Import Node Modules
=================== */
const express = require('express'); //web framework for node
const app = express(); //initialise express app
const router = express.Router(); //initialise router through express
const mongoose = require('mongoose'); //schema for MongoDB
const config = require('./config/database'); //config for mongoose
const path = require('path'); //package for filepaths
const auth = require('./routes/auth')(router);//initialise authentication router for whole website
const bodyParser =require('body-parser');
const cors = require('cors');//enables cross-platform communication between frontend and backend

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
app.use(bodyParser.urlencoded({extended: false}));
//parse json
app.use(bodyParser.json());

//provides static directory for frontend
app.use(express.static(__dirname + '/client/dist/'));
app.use('/auth', auth);

//connects server to angular2 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});
