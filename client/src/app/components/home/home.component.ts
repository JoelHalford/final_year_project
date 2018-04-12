import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username;///users username
  admin;//users admin status

  constructor(
	public authService: AuthService
  ) { }

  ngOnInit() 
  {//on initialisation
  	if (this.authService.loggedIn())
  	{//check if user is logged in
	  	this.authService.getProfile().subscribe(profile => 
        {//subscribe to authService getProfile
        //get users username
	  		this.username = profile.user.username;
        //get users admin status
        this.admin = profile.user.admin;
	  	});
  	}
  }

}
