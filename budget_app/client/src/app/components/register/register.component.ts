import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';	//allows reactive forms to be built with validation
import { Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	form: FormGroup; //exports form
	checker;		 //sends validation message
	checkerClass;	 //checks validation
	processing = false;	//disable button

	constructor(
			private formBuilder: FormBuilder,
			private authService: AuthService,
			private router: Router
	) { 
		this.createForm();
	}

  //function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      //uername Input
      username: ['', Validators.compose([
        Validators.required, //field is required
        Validators.minLength(3), //minimum length is 3 characters
        Validators.maxLength(15), //maximum length is 15 characters
        this.validateUsername //custom validation
      ])],
      //password Input
      password: ['', Validators.compose([
        Validators.required, //field is required
        Validators.minLength(4), //minimum length is 4 characters
        Validators.maxLength(20), //maximum length is 20 characters
        this.validatePassword //custom validation
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required] //field is required
    }, { validator: this.matchingPasswords('password', 'confirm') }); //add custom validator to form for matching passwords
  }

  //function to validate username format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    //test
    if (regExp.test(controls.value)) {
      return null; //return as valid username
    } else {
      return { 'validateUsername': true } //return as invalid username
    }
  }

  //function to validate password
  validatePassword(controls) {
    //create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    //test password
    if (regExp.test(controls.value)) {
      return null; //return as valid password
    } else {
      return { 'validatePassword': true } //return as invalid password
    }
  }

  //ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  //submit form
  onRegisterSubmit() {
  	this.processing = true;
  	const user = {
  		username: this.form.get('username').value,
  		password: this.form.get('password').value
  	}

  	this.authService.registerUser(user).subscribe(data => {
  		if (!data.success) {
  			this.checkerClass = 'alert alert-danger';
  			this.checker = data.message;
  			this.processing = false;
  		}else {
  			this.checkerClass = 'alert alert-success';
  			this.checker = data.message;
  		}
  	});
  }

	ngOnInit() {
	}

}
