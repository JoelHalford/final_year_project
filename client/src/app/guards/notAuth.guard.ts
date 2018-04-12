//start of module imports
import { Injectable } from '@angular/core';
import { CanActivate, Router }	from '@angular/router';
//end of module imports
//start of services
import { AuthService } from '../services/auth.service';
//end of services

@Injectable()
export class NotAuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
	){}

	canActivate() 
	{
		if (this.authService.loggedIn()) 
		{//if user is not logged in, redirect to homepage
			this.router.navigate(['/home']);
			return false;
		} else 
		{//proceed
			return true;
		}
	}
}