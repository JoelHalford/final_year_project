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

	canActivate() {
		if (this.authService.loggedIn()) {
			this.router.navigate(['/home']);
			return false;
		} else {
			return true;
		}
	}
}