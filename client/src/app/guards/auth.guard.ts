//start of module imports
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot,
		 RouterStateSnapshot }	from '@angular/router';//for checking URLs
//end of module imports
//start of services
import { AuthService } from '../services/auth.service';
//end of services

@Injectable()
export class AuthGuard implements CanActivate 
{
	fixUrl;

	constructor(
		private authService: AuthService,
		private router: Router
	){}

	canActivate(
		router: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	){
		if (this.authService.loggedIn()) 
		{//allow access if user is logged in
			return true;
		} else 
		{//redirect to login page
			this.fixUrl = state.url;
			this.router.navigate(['/login']);
			return false;
		}
	}
}