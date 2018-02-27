const User = require('../models/user'); //import user model schema
const Product = require('../models/product'); //import product model schema
const jwt = require('jsonwebtoken');
const config = require('../config/database'); //import database config

module.exports = (router) => {

	router.get('/allUserProducts', (req, res) => 
	{//grab all products
		Product.find({}, (err, products) => 
			{
				if (err) 
				{//if an error occurs
					res.json({ success: false, message: err	});
				}
				else if (!products) 
				{//if no products in database
					res.json({ success: false, message: 'No products found.'});
				}
				else 
				{//if no errors, success
					res.json({ success: true, products: products});
				}
			//sorts by latest posted product
			}).sort({'_id': -1});
		});

	return router;
};