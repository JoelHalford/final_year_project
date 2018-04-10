import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username;
  admin;

  constructor(
	public authService: AuthService
  ) { }

  ngOnInit() 
  {
  	if (this.authService.loggedIn())
  	{
	  	this.authService.getProfile().subscribe(profile => {
	  		this.username = profile.user.username;
        this.admin = profile.user.admin;
	  	});
  	}
  }

}
