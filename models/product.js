const mongoose = require('mongoose');	//import mongoose
mongoose.Promise = global.Promise;		//setup mongoose global promise
const Schema = mongoose.Schema;			//setup mongoose schema

let nameLengthChecker = (product_name) => 
{//check product name length
	if (!product_name) {
		return false;
	} else {
		if (product_name.length < 1 || product_name.length > 40) {
			return false;
		} else {
			return true;
		}
	}
};

let alphaNumericNameChecker = (product_name) => 
{//check product name is alphanumeric
	if (!product_name) {
		return false;
	} else {
		const regExp = new RegExp(/^(?=.*[^\W_])[\w ]*$/);
		return regExp.test(product_name);
	}
};

const nameValidators = 
[//validation for product name
	{
		validator: nameLengthChecker, 
		message:   "Product name must be between 4 and 40 characters"
	},
	{
		validator: alphaNumericNameChecker, 
		message:   "Product name can't have any special characters"
	}
];

///////////////////////////////////////
////////END OF NAME VALIDATION/////////
////////START OF PRICE VALIDATION//////
///////////////////////////////////////

let priceNameChecker = (product_price) => 
{//check price is numeric
	if (!product_price || product_price < 0) {
		return false;
	} else {
		const regExp = new RegExp(/^[0-9]\d{0,7}(?:\.\d{1,4})?$/);
		return regExp.test(product_price);
	}
};

const priceValidators = 
[//validation for price
	{
		validator: priceNameChecker, 
		message: "Product price must be a number"
	}
];

///////////////////////////////////////
////////END OF PRICE VALIDATION////////
////////START OF LOCATION VALIDATION///
///////////////////////////////////////

let locationLengthChecker = (product_location) => 
{//check product name length
	if (!product_location) {
		return false;
	} else {
		if (product_location.length < 1 || product_location.length > 40) {
			return false;
		} else {
			return true;
		}
	}
};

const locationValidators = 
[//validation for location
	{
		validator: locationLengthChecker, 
		message:   "Product location must be between 4 and 40 characters"
	}
];

///////////////////////////////////////
////////END OF LOCATION VALIDATION/////
////////START OF ID VALIDATION/////////
///////////////////////////////////////

let idLengthChecker = (product_id) => 
{//check product name length
	if (!product_id) 
	{//if no product_id provided, return false
		return false;
	} 
	else 
	{//if product_id is provided
		if (product_id.length > 40) 
		{//if product is more than 40, return false
			return false;
		} else 
		{//if product is less than 40, return true
			return true;
		}
	}
};

const idValidators = 
[//validation for product ID
	{//id length validator name and message to send to client
		validator: idLengthChecker, 
		message:   "Product ID must be below 40 characters"
	}
];
///////////////////////////////////////
////////END OF ID VALIDATION///////////
////////START OF COMMENT VALIDATION////
///////////////////////////////////////

let commentLengthChecker = (comment) => 
{//check product name length
	if (!comment[0]) {
		return false;
	} else {
		if (comment[0].length < 1 || comment[0].length > 100) {
			return false;
		} else {
			return true;
		}
	}
};

const commentValidators = 
[//validation for comments
	{
		validator: commentLengthChecker, 
		message:   "Comments must be between 0 and 100 characters"
	}
];

///////////////////////////////////////
////////END OF COMMENT VALIDATION//////
////////START OF PRODUCT SCHEMA///////
///////////////////////////////////////

const productSchema = new Schema({
	product_name: {
		type: String,
		required: true,
		validate: nameValidators
	},
	product_price: {
		type: Number,
		required: true,
		min: 0,
		max: 100000,
		validate: priceValidators
	},
	product_location: {
		type: String,
		validate: locationValidators
	},
	product_id: {
		type: String,
		validate: idValidators
	},
	likes: {
		type: Number,
		default: 0
	},
	likedBy: {
		type: Array
	},
	comments: [
		{
			comment: {
				type: String,
				validate: commentValidators
			},
			commentator: {
				type: String
			}

		}

	],
	createdBy: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	product_private: {
		type: String
	}
});


//exports product schema
module.exports = mongoose.model('Product', productSchema);