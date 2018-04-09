import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  
  posts;
  likes;
  checkerClass;
  checker;
  foundUser = false;
  username;
  currentUrl;

  constructor(
  	private authService: AuthService,
  	private activatedRoute: ActivatedRoute,
  	private router: Router
  ) { }

  ngOnInit() 
  {//on initialisation
  	this.currentUrl = this.activatedRoute.snapshot.params;
  	this.authService.getProfile().subscribe(profile => 
    {//subscribe to getProfile service inside /services/auth.service
      //set logged in user to username
  		this.username = profile.user.username;
  		this.foundUser = true;
      //call getAllProducts
    });
  }

  deleteUser()
  {//function for deleting a product
  	this.authService.deleteUser(this.currentUrl.id).subscribe(data =>
  	{//grabs the current id of the url
  		if (!data.success)
  		{//if sending of data is unsuccessful, throw danger warning
  			this.checkerClass = 'alert alert-danger';
  			this.checker = data.message;
  		}
  		else
  		{//else if successful, throw success warning
  			this.checkerClass = 'alert alert-success';
  			this.checker = data.message;

  			setTimeout(() => 
  			{//redirect back to /products after 2.5 seconds
  				this.authService.logout();
  				this.router.navigate(['/']);
  			}, 2500);
  		}
  	});
  }
}