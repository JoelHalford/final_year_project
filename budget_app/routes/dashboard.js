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
	{//grab all budgets
		Budget.find({}, (err, budgets) => 
		{
			if (err) 
			{//if an error occurs
				res.json({ success: false, message: err	});
			}
			else if (!budgets) 
			{//if no budgets in database
				res.json({ success: false, message: 'No budgets found.'});
			}
			else 
			{//if no errors, success
				res.json({ success: true, budgets: budgets});
			}
		//sorts by latest posted budget
		}).sort({'_id': -1});
	});

	router.post('/newBudget', (req, res) =>
	{//post for adding a new budget
		const budget = new Budget(
		{//create an object for budget
			username: req.body.username,
			budget_price: parseFloat(req.body.budget_price).toFixed(2)
		});

		budget.save((err) => 
		{//save budget into database
			if (err) 
			{//if any errors were found
				if (err.errors) 
				{
					if (err.errors.budget_price) 
					{//if error caused by budget price
						res.json({ success: false, message: "Must be a number." });
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

router.put('/editBudget', (req, res) => 
	{//update a budget

		_id = req.body._id;

		if(!_id) 
		{//return error if no ID provided
			res.json({ success: false, message: 'No budget ID provided.'});
		}
		else
		{
			Budget.findOne({ _id }, (err, budget) =>
			{
				if (err)
				{///if error not a valid budget ID
					res.json({ success: false, message: 'Budget ID not valid.'});
				}
				else if (!budget)
				{//if budget ID not found
					res.json({ success: false, message: 'Budget ID not found'});
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
						else if (user.username !== budget.username)
						{//if user is not the one that created the budget
							res.json({ success: false, message: 'You are not the creator of this budget.'});
						}
						else
						{//if user is the creator of the budget, allow them to edit							
							budget.budget_price = Number.parseFloat(req.body.budget_price).toFixed(2),
							budget.budget_spent = Number.parseFloat(req.body.budget_spent).toFixed(2),

							budget.save((err) =>
							{
								if (err)
								{//if any errors saving, output error message
									res.json({ success: false, message: "Budget must be a number." });
								}
								else
								{//if no errors, update budget
									res.json({ success: true, message: 'Budget updated successfully.'});
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