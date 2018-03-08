const User = require('../models/user'); //import user model schema
const Product = require('../models/product'); //import product model schema
const Budget = require('../models/budget');     //import budget model schema
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

	router.get('/allBudgets', (req, res) => 
	{//grab all products
		Budget.find({}, (err, budgets) => 
		{
			if (err) 
			{//if an error occurs
				res.json({ success: false, message: err	});
			}
			else if (!budgets) 
			{//if no products in database
				res.json({ success: false, message: 'No budgets found.'});
			}
			else 
			{//if no errors, success
				res.json({ success: true, budgets: budgets});
			}
		//sorts by latest posted product
		}).sort({'_id': -1});
	});

	router.post('/newBudget', (req, res) =>
	{//post for adding a new budget
		const budget = new Budget(
		{//create an object for product
			username: req.body.username,
			budget_price: req.body.budget_price			
		});

		budget.save((err) => 
		{//save budget into database
			if (err) 
			{//if any errors were found
				if (err.errors) 
				{
					if (err.errors.budget_price) 
					{//if error caused by product name
						res.json({ success: false, message: err.errors.budget_price.message });
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
				res.json({ success: true, message: "Budget added."});
			}
		});
	});

	return router;
};