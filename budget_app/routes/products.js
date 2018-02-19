const User = require('../models/user'); //import user model schema
const Product = require('../models/product'); //import product model schema
const jwt = require('jsonwebtoken');
const config = require('../config/database'); //import database config

module.exports = (router) => {

	router.post('/newProduct', (req,res) => {
		if (!req.body.product_name) {
			res.json({ success: false, message: 'Name is required.'});
		} 
		else if (!req.body.product_price) 
		{
			res.json({ success: false, message: 'Price is required.'});
		} 
		else if (!req.body.createdBy) 
		{
			res.json({ success: false, message: 'Product creator is required.'});
		} 
		else 
		{
			const product = new Product(
			{
				product_name: req.body.product_name,
				product_price: req.body.product_price,
				product_location: req.body.product_location,
				product_id: req.body.product_id,
				createdBy: req.body.createdBy
			});
			product.save((err) => 
			{
				if (err) {
					if (err.errors) {
						if (err.errors.product_name) 
						{
							res.json({ success: false, message: err.errors.product_name.message });
						} 
						else if (err.errors.product_price) 
						{
							res.json({ success: false, message: err.errors.produce_price.message });
						} 
						else if (err.errors.product_location)
						{
							res.json({ success: false, message: err.errors.produce_location.message });
						}
						else if (err.errors.product_id)
						{
							res.json({ success: false, message: err.errors.produce_id.message });
						} 
						else
						{
							res.json({ success:false, message: err.errmsg });
						}
					} 
					else 
					{
						res.json({ success: false, message: err});
					}
				} 
				else 
				{
					res.json({ success: true, message: "Product created."});
				}
			});
		}
	});
		
	router.get('/allProducts', (req, res) => 
	{
		Product.find({}, (err, products) => 
			{
				console.log("hello");
				if (err) 
				{
					res.json({ success: false, message: err	});
				}
				else if (!products) 
				{
					res.json({ success: false, message: 'No products found.'});
				}
				else 
				{
					res.json({ success: true, products: products});
				}
			}).sort({'_id': -1});
		});

return router;
};