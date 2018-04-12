import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username;//users username
  admin;//users admin status

  constructor(
	public authService: AuthService,
	private router: Router
  ) { }

  ngOnInit() 
  {//on initialisation
    if (this.authService.loggedIn())
    {//check if user is logged in
      this.authService.getProfile().subscribe(profile => 
      { //get users username
        this.username = profile.user.username;
        //get users admin status
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
