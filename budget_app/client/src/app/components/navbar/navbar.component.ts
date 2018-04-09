import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username;
  admin;

  constructor(
	public authService: AuthService,
	private router: Router
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

  logoutClick() 
  {//if user clicks logout, send them home
  	this.authService.logout();
  	this.router.navigate(['/home']);
  }
}
