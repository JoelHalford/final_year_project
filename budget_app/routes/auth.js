const User = require('../models/user'); //Import user model schema
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

	//validation for register POST
	router.post('/register', (req,res) => {

		if (!req.body.username) {//if no username is provided
			res.json({success: false, message: 'Must provide username'});
		} else if (!req.body.password)
		{//if no password provided
			res.json({success: false, message: 'Must provide password'});
		} else {
			let user = new User({//if both created, store username and password in variables
				username: req.body.username.toLowerCase(),
				password: req.body.password
			});
			user.save((err) => {//save user
				if (err) {//if error message
					if (err.code === 11000) {//if duplication error
						res.json({ success: false, message: 'Duplicate username. Error: '});
					} else {
					if(err.errors) {
						if(err.errors.username) {
							res.json({success: false, message: err.errors.username.message});
						} else {
							if (err.errors.password) {
								res.json({ success: false, message: err.errors.password.message });
							} else {
								res.json({ success: false, message: err});
							}
						}
					} else {//error saving user
						res.json({ success: false, message: 'Could not save user. Error: ', err});
						}			
					}
				} else {//user was saved
					res.json({success: true, message: 'User saved'});
				}
			});
		}
	});

	//validation for login POST
	router.post('/login', (req, res) => {
		if (!req.body.username) {//if username not provided
			res.json({ success: false, message: 'Must provide username'});
		} else if (!req.body.password) {//if password not provided
			res.json({ success: false, message: 'Must provide password'});
		} else {
			User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {//find user
				if (err) {//if any errors
					res.json({ success: false, message: err});
				} else if (!user) {//if user not found
					res.json({ success: false, message: 'Username not found'});
				} else {
					const validPassword = user.comparePassword(req.body.password);
					if (!validPassword) {//if password is not valid
						res.json({ success: false, message: 'Password not valid'});
					} else {//if success, create token and user
						const token = jwt.sign({ userId: user._id }, config.secret, {expiresIn: '24h'}); //creates user token with ID from DB, expires in 12h
						res.json({ success: true, message: 'Success!', token: token, user: { username: user.username }});	//sends back success, user token and username
					}
				}
			});
		}
		
	});

	//middleware for headers
  router.use((req, res, next) => {
    const token = req.headers['auth']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

	//intercept headers/get user profile
  router.get('/profile', (req, res) => {
    //search for user in database
    User.findOne({ _id: req.decoded.userId }).select('username').exec((err, user) => {
      //check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        //check if user was found
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  return router; // Return router object to main index.js
}

