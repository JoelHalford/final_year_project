import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component(
{
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit 
{
  checker;
  checkerClass;
  currentUrl;
  username;
  found = false;

  constructor(
  	private authService: AuthService,
  	private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() 
  {//on initialisation
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.authService.getPublicProfile(this.currentUrl.username).subscribe(data =>
  	{
  		if (!data.success)
  		{//if incorrect username is sent, send error message
  			this.checkerClass = 'alert alert-danger';
  			this.checker = "Username does not exist."
  		}
  		else
  		{//if no errors, send data according
  			this.found = true;
  			this.username = data.user.username;
  		}
  	})
  }
}
