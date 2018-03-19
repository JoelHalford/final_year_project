const User = require('../models/user'); 		//import user model schema
const Product = require('../models/product');   //import product model schema
const jwt = require('jsonwebtoken');
const config = require('../config/database'); //import database config

module.exports = (router) => {

	router.post('/newProduct', (req,res) => 
		{//post a new product
		if (!req.body.product_name) 
		{//if no name is input
			res.json({ success: false, message: 'Name is required.'});
		} 
		else if (!req.body.product_price) 
		{//if no price is input
			res.json({ success: false, message: 'Price is required.'});
		} 
		else if (!req.body.createdBy) 
		{//if no creator is input
			res.json({ success: false, message: 'Product creator is required.'});
		} 
		else 
		{//if no errors were found
			const product = new Product(
			{//create an object for product
				product_name: req.body.product_name,
				product_price: req.body.product_price,
				product_location: req.body.product_location,
				product_id: req.body.product_id,
				product_private: req.body.product_private,
				createdBy: req.body.createdBy
			});
			product.save((err) => 
			{//save product into database
				if (err) 
				{//if any errors were found
					if (err.errors) 
					{
						if (err.errors.product_name) 
						{//if error caused by product name
							res.json({ success: false, message: err.errors.product_name.message });
						} 
						else if (err.errors.product_price) 
						{//if error caused by product price
							res.json({ success: false, message: err.errors.produce_price.message });
						} 
						else if (err.errors.product_location)
						{//if error caused by product location
							res.json({ success: false, message: err.errors.produce_location.message });
						}
						else if (err.errors.product_id)
						{//if error caused by product id
							res.json({ success: false, message: err.errors.produce_id.message });
						} 
						else
						{//if another error
							res.json({ success:false, message: err.errmsg });
						}
					} 
					else 
					{
						res.json({ success: false, message: err});
					}
				} 
				else 
				{//if zero errors, success
					res.json({ success: true, message: "Product created."});
				}
			});
		}
	});
		
	router.get('/allProducts', (req, res) => 
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

	router.get('/singleProduct/:id', (req, res) =>
	{//grab a single product
		if (!req.params.id) 
		{//if product id not provided
			res.json({ success: false, message: 'No product ID was found.'});
		}
		else
		{//if id was provided, find in database
			Product.findOne({ _id: req.params.id }, (err, product) => 
			{//find single product in database
				if (err)
				{//if error, not a valid ID
					res.json({ success: false, message: 'Not a valid product ID.' });
				}
				else if (!product)
				{//if no product for ID
					res.json({ success: false, messsage: 'Product not found.'});
				}
				else
				{//if no errors found
					User.findOne({ _id: req.decoded.userId }, (err, user) => 
					{//find logged in user
						if (err) 
						{//if any errors finding user
							res.json({ success: false, message: err});
						}
						else if (!user)
						{//if user not found
							res.json({ success: false, message: 'Unable to find user.'});
						}
						else if (user.username !== product.createdBy)
						{//if loggeg in user is not the creator of the post
							res.json({ success: false, message: "You are not the creator of this post."});
						}
						else
						{//if no errors occur, display product
							res.json({ success: true, product: product });
						}
					});
				}
			});
		}
	});

	router.put('/updateProduct', (req, res) => 
	{//update a product
		if(!req.body._id) 
		{//return error if no ID provided
			res.json({ success: false, message: 'No product ID provided.'});
		}
		else
		{
			Product.findOne({ _id: req.body._id }, (err, product) =>
			{
				if (err)
				{///if error not a valid product ID
					res.json({ success: false, message: 'Product ID not valid.'});
				}
				else if (!product)
				{//if product ID not found
					res.json({ success: false, message: 'Product ID not found'});
				}
				else
				{//check user was the one that
					User.findOne({ _id: req.decoded.userId }, (err, user) =>
					{
						if (err)
						{//if an error occurs
							res.json({ success: false, message: err });
						}
						else if (!user)
						{//if user is not found
							res.json({ success: false, message: 'Unable to find user.'});
						}
						else if (user.username !== product.createdBy)
						{//if user is not the one that created the product
							res.json({ success: false, message: 'You are not the creator of this post.'});
						}
						else
						{//if user is the creator of the product, allow them to edit
							product.product_name = req.body.product_name;
							product.product_price = req.body.product_price;
							product.product_location = req.body.product_location;
							product.product_id = req.body.product_id;
							product.save((err) =>
							{
								if (err)
								{//if any errors saving, output error message
									res.json({ success: false, message: err });
								}
								else
								{//if no errors, update product
									res.json({ success: true, message: 'Product updated successfully.'});
								}
							});
						}

					});
				}
			});
		}

	});

	router.delete('/deleteProduct/:id', (req,res) =>
	{//route for deleting product
		if (!req.params.id)
		{//if no ID was provided
			res.json({ success: false, message: 'No ID given.'});
		}
		else
		{//if ID was provided
			Product.findOne({ _id: req.params.id }, (err, product) =>
			{//find single product in database
				if (err)
				{//if error, post invalid ID
					res.json({ success: false, message: 'Invalid ID.'});
				}
				else if (!product)
				{//if product not found
					res.json({ success: false, message: 'Product not found.'});
				}
				else
				{//if no errors
					User.findOne({ _id: req.decoded.userId }, (err, user) =>
					{
						if (err)
						{//if error given
							res.json ({ success: false, message: err });
						}
						else if (!user)
						{//if user not found
							res.json ({ success: false, message: "User not found" });
						}
						else
						{//if no errors returned
							if (user.username !== product.createdBy)
							{//if username does not equal same user that created product
								res.json ({ success: false, message: "You are not the user that created this post."});
							}
							else
							{//if username does equal same as user that created product
								product.remove((err) =>
								{//try to remove product from database
									if (err)
									{//if any errors
										res.json ({ success: false, message: err });
									}
									else
									{//if no errors, delete product post successfully
										res.json ({ success: true, message: 'Product deleted successfully.' });
									}
								})
							}
						}
					})
				}
			})
		}
	});

	router.put('/likeProduct', (req, res) => {
		if (!req.body.id)
		{
			res.json ({ success: false, message: 'No product id provided.' });
		}
		else
		{
			Product.findOne({ _id: req.body.id }, (err, product) =>
			{
				if (err)
				{
					res.json ({ success: false, message: 'Not a valid product id.' });
				}
				else if (!product)
				{
					res.json ({ success: true, message: 'The product was not found.' });
				}
				else
				{
					User.findOne({ _id: req.decoded.userId }, (err, user) =>
					{
						if (err)
						{
							res.json ({ success: false, message: err });
						}
						else if (!user)
						{
							res.json ({ success: false, message: 'The user was not found.' });
						}
						else if (user.username === product.createdBy)
						{
							res.json ({ success: false, message: 'Cannot like your own product post.' });
						}
						else if (product.likedBy.includes(user.username))
						{
							res.json ({ success: false, message: 'You already liked the post.' });
						}
						else
						{
							product.likes++;
							product.likedBy.push(user.username);
							product.save((err) =>
							{
								if (err)
								{
									res.json ({ success: false, message: err });
								}
								else
								{
									res.json ({ success: true, message: 'Product liked.' });
								}
							});
						}
					});
				}
			})
		}
	});

	router.post('/comment', (req, res) =>
	{
		if (!req.body.comment)
		{
			res.json ({ success: false, message: "No message provided." });
		}
		else if (!req.body.id)
		{
			res.json ({ success: false, message: "No ID provided." });
		}
		else
		{
			Product.findOne({ _id: req.body.id}, (err, product) =>
			{
				if (err)
				{
					res.json ({ success: false, message: "Invalid product ID provided." });
				}
				else if (!product)
				{
					res.json ({ success: false, message: "Product not found." });
				}
				else
				{
					User.findOne({ _id: req.decoded.userId }, (err, user) =>
					{
						if (err)
						{
							res.json ({ success: false, message: "Error found." });
						}
						else if (!user)
						{
							res.json ({ success: false, message: "User not found." });
						}
						else
						{
							product.comments.push({
								comment: req.body.comment,
								commentator: user.username
							});
							product.save((err) =>
							{
								if (err)
								{
									res.json ({ success: false, message: "Error found." });
								}
								else
								{
									res.json ({ success: true, message: "Message saved." });
								}
							});
						}
					});
				}
			});
		}
	});

return router;
};