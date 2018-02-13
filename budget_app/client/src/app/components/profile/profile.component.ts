import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	username; //users username

  constructor(
  		private authService: AuthService
  	) { }

  ngOnInit() {//on initialisation, place username into profile
  	this.authService.getProfile().subscribe(profile => {
  		this.username = profile.user.username;
  });
  }

}
