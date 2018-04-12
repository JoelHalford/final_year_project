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
	form;     //exports form
	checker;		         //sends validation message
	checkerClass;	       //checks validation
	processing = false;	 //disable button

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) 
  {//create Login Form when component is constructed    
    this.createForm();
  }
  createForm() 
  {//create login form
    this.form = this.formBuilder.group({
      username: ['', Validators.required], //username field
      password: ['', Validators.required] //password field
    });
  }
  onLoginSubmit() 
  {//submit form and login user
    this.processing = true; //submit button processed
    const user = 
    {//create user object from input username and password
      username: this.form.get('username').value, //username input field
      password: this.form.get('password').value  //password input field
    }
    //function to send login data to API
    this.authService.login(user).subscribe(data => {
      //check if response was a success or error
      if (!data.success) 
        {//if data successful
        this.checkerClass = 'alert alert-danger'; //set bootstrap error class
        this.checker = data.message; //set error message
        this.processing = false;     //enable submit button
      } else 
      {//if data successful
        this.checkerClass = 'alert alert-success'; //success class
        this.checker = data.message; //set message
        //store user token in local storage
        this.authService.storeUserData(data.token, data.user);
        //after 2.5 seconds, redirect to dashboard page
        setTimeout(() => 
        {//set timeout of 2500ms
          this.router.navigate(['/dashboard']); //navigate to dashboard view
        }, 2500);
      }
    });
  }
  ngOnInit() {
  }
}