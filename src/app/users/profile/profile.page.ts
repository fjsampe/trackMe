import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { RequestsService } from '../../requests/services/requests.service';
import { User } from '../interfaces/user';
import { AuthService } from '../../auth/services/auth.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage {
  user:User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private requestsService: RequestsService,
    private authService: AuthService,
    private events: Events
  ) { }



  async ngAfterViewInit() {
    console.log("PARAMETRO RUTA: ", this.route.snapshot.params.id);
    let accessCompany:AccessCompany = await this.requestsService.getAccessCompany();
    
    this.usersService.getProfile(accessCompany,this.route.snapshot.params.id != "undefined" ? this.route.snapshot.params.id : null).subscribe(
      u => {
        this.user = u;
        this.user.me=this.route.snapshot.params.id !== "undefined"?true:false;
      
        console.log("USUARIO DESDE PROFILE PAGE ONAFTER ",this.user);
        
      }
    );
    
  }



  logout() {
    this.authService.logout().then(()=>{
      console.log("PROFILE_PAGE EJECUTADO EL LOGOUT");
      this.events.publish('user:loggedout');
      this.router.navigate(['auth']);
    });
    
  } 






}
