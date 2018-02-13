const mongoose = require('mongoose');	//import mongoose
mongoose.Promise = global.Promise;		//setup mongoose global promise
const Schema = mongoose.Schema;			//setup mongoose schema
const bcrypt = require('bcrypt-nodejs');	//import password encryption
var uniqueValidator = require('mongoose-unique-validator');	//import mongoose validation

let usernameLengthChecker = (username) => {//check username length
	if (!username) {
		return false;
	} else {
		if (username.length < 4 || username.length > 13) {
			return false;
		} else {
			return true;
		}
	}
};

let validUsername = (username) => {//check username characters
	if (!username) {
		return false;
	} else {
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(username);
	}
};

const usernameValidators = [//validation for username
	{
		validator: usernameLengthChecker, 
		message: 'Username must be atleast 4 characters or less than 14 characters'
	},
	{
		validator: validUsername, 
		message: "Username can't have any special characters"
	}
];

let passwordLengthChecker = (password) => {//check password length
	if (!password) {
		return false;
	} else if (password.length < 8 || password.length > 15) {
		{
			return true;
		}
	}
};


let validPassword= (password) => {//check password characters
	if (!password) {
		return false;
	} else {
		const regExp = new
		RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		return regExp.test(password);
	}
};

const passwordValidators = [{//validation for password
	validator: passwordLengthChecker,
	message: "Password must be atleast 4 or less than 20 characters"
}, {
	validator: validPassword,
	message: 'Must have at least one uppercase, lowercase, special character and number'
}];

const userSchema = new Schema({//setup for user schema
	username: {//validation for username
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: usernameValidators
	},
	password: {//validation for password
		type: String,
		required: true,
		validate: passwordValidators
	}
});

//pre-saving schema, hash password using bcrypt
userSchema.pre('save', function(next){
	if (!this.isModified('password'))
	{
		return next();
	}

	//encrpts users password
	bcrypt.hash(this.password, null, null, (err, hash) => {
		if (err) return next(err);
		this.password = hash;
		next();
	});
});

//validates password is unique
userSchema.plugin(uniqueValidator);

//decrypts users password
userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

//exports user schema
module.exports = mongoose.model('User', userSchema);