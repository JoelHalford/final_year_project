import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	form: FormGroup; //exports form
	checker;		 //sends validation message
	checkerClass;	 //checks validation
	processing = false;	//disable button

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); //create Login Form when component is constructed
  }

  //create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], //username field
      password: ['', Validators.required] //password field
    });
  }

  //submit form and login user
  onLoginSubmit() {
    this.processing = true; //submit button processed
    //create user object
    const user = {
      username: this.form.get('username').value, //username input field
      password: this.form.get('password').value //password input field
    }

    //function to send login data to API
    this.authService.login(user).subscribe(data => {
      //check if response was a success or error
      if (!data.success) {
        this.checkerClass = 'alert alert-danger'; //set bootstrap error class
        this.checker = data.message; //set error message
        this.processing = false; //enable submit button
      } else {
        this.checkerClass = 'alert alert-success'; //success class
        this.checker = data.message; //set message
        //store user token in local storage
        this.authService.storeUserData(data.token, data.user);
        //after 2.5 seconds, redirect to dashboard page
        setTimeout(() => {
          this.router.navigate(['/dashboard']); //navigate to dashboard view
        }, 2500);
      }
    });
  }

  ngOnInit() {
  }

}