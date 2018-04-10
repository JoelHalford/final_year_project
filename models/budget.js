const mongoose = require('mongoose');	//import mongoose
mongoose.Promise = global.Promise;		//setup mongoose global promise
const Schema = mongoose.Schema;			//setup mongoose schema

let budgetNameChecker = (budget) => 
{//check budget is numeric
	if (!budget || budget < 0) {
		return false;
	} else {
		const regExp = new RegExp(/^[1-9]\d{0,7}(?:\.\d{1,4})?$/);
		return regExp.test(budget);
	}
};

const budgetValidators = 
[//validation for budget
	{
		validator: budgetNameChecker, 
		message: "Budget must be a number"
	}
];

const budgetSchema = new Schema({//setup for user schema
	username: {
		type: String
	},
	date_now: {//validation for username
		type: Date,
		default: Date.now()
	},
	budget_price: {
		type: Number,
		required: true,
		validate: budgetValidators
	},
	budget_spent: {
		type: Number
	}
});

//exports user schema
module.exports = mongoose.model('Budget', budgetSchema);