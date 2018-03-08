import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username = "empty";

  constructor(
	private authService: AuthService
  ) { }

  ngOnInit() 
  {
  	if (this.authService.loggedIn())
  	{
	  	this.authService.getProfile().subscribe(profile => {
	  		this.username = profile.user.username;
	  	});
  	}
  }

}
