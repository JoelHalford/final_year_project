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

	form; //exports form
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
        Validators.required,      //field is required
        Validators.minLength(3),  //minimum length is 3 characters
        Validators.maxLength(15), //maximum length is 15 characters
        this.validateUsername     //custom validation
      ])],
      //password input
      password: ['', Validators.compose([
        Validators.required,      //field is required
        Validators.minLength(4),  //minimum length is 4 characters
        Validators.maxLength(20), //maximum length is 20 characters
        this.validatePassword     //custom validation
      ])],
      //confirm password input
      confirm: ['', Validators.required] //field is required
        //add custom validator to form for matching passwords
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }

  //function to validate username format
  validateUsername(controls) {
    //create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    //test
    if (regExp.test(controls.value)) 
    {//return as invalid username
      return null;
    } else 
    {//return as valid username
      return { 'validateUsername': true }
    }
  }
  //function to validate password
  validatePassword(controls) {
    //create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    //test password
    if (regExp.test(controls.value)) 
    {//return as valid password
      return null;
    } else 
    {//return as invalid password
      return { 'validatePassword': true } 
    }
  }

  //ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) 
      {//returns as a match
        return null;
      } else 
      {//return as error
        return { 'matchingPasswords': true } 
      }
    }
  }
  //submit form
  onRegisterSubmit() 
  {//upon registering
  	this.processing = true;
  	const user = 
    {//add input username and password to user
    	username: this.form.get('username').value,
    	password: this.form.get('password').value
  	}

  	this.authService.registerUser(user).subscribe(data => 
    {//subscribe to registerUser service at /services/auth.service
  		if (!data.success) 
        {//if data unsuccessful
  			this.checkerClass = 'alert alert-danger';
  			this.checker = data.message;
  			this.processing = false;
  		}
      else 
      {//if data successful
  			this.checkerClass = 'alert alert-success';
  			this.checker = data.message;

        setTimeout(() => 
        {//set timeout of 2500ms
          this.router.navigate(['/login']); //navigate to dashboard view
        }, 2500);
  		}
  	});
  }

	ngOnInit() {
	}
}
