import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage/storage.service';
import { RequestsService } from './requests/services/requests.service';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services/auth.service';
import { UsersService } from './users/services/users.service';
import { AccessCompany } from './auth/interfaces/accessCompany';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  is_logged = false;
  imageAvatar: SafeUrl;
  accessCompany: AccessCompany;
  name: string;
  appPages: Array<{ title: string, url: string, icon: string }>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private storageService: StorageService,
    private requestsService: RequestsService,
    private authService: AuthService,
    private usersService: UsersService,
    private sanitizer: DomSanitizer
  ) {

    this.appPages = [
      {
        title: 'Inicio',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'Login',
        url: '/auth/login',
        icon: 'contact'
      }
    ];


    this.events.subscribe('user:loggedIn', async () => {
      this.accessCompany = await this.requestsService.getAccessCompany();
      console.log("LANZO EVENTO LOGIN EN APPCOMPONENT y ACCESSCOMPANY VALE:", this.accessCompany);
      this.configurePages();
      this.usersService.getProfile(this.accessCompany).subscribe((usu) => {
        console.log("USU EN EVENTO LOGIN EN APPCOMPONENT", usu);
        this.imageAvatar = usu.avatar;
        this.name = usu.name;
        this.is_logged = true;
      });
    });

    this.events.subscribe('user:requestIn', () => {
      this.getValuesRequestIn();
    });

    this.events.subscribe('user:loggedout', () => {
      console.log("########### LOGOUT USER ###############");
      this.configurePagesInit();
    });

    this.initializeApp();
  }

  async initializeApp() {
    console.log("********* APP COMPOMEMT INITIALIZEAPP ************");
    this.accessCompany = await this.requestsService.getAccessCompany();
    console.log("ACCESS COMPANY...", this.accessCompany);
    if (this.accessCompany !== null) {
      console.log("INIZIALIZE APP + ACCESSCOMPANY", this.accessCompany);
      this.authService.isLogged(this.accessCompany).subscribe((ok) => {
        console.log("ISLOGGED: ", ok);
        if (ok) {
          this.getProfile(this.accessCompany);
        }
      });
    } else {
      this.configurePagesInit();
    }


    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }



  async getValuesRequestIn() {
    this.accessCompany = await this.requestsService.getAccessCompany();
    this.getProfile(this.accessCompany);
  }



  async getProfile(accessCompany: AccessCompany) {
    //this.accessCompany = await this.requestsService.getAccessCompany();
    this.is_logged = true;
    this.configurePages();
    //Obtengo el usuario..
    this.usersService.getProfile(this.accessCompany).subscribe((usu) => {
      console.log("USUARIO CAPTURADO DES APPCOMPONENT", usu);
      if (usu === undefined || usu === null) {
        console.log("NO TENGO USUARIO");
        this.logout();
      } else {
        
        if (usu.avatar === null) {
          console.log("TENGO AVATAR VACIO");
          this.imageAvatar = "data:image/jpeg;base64," + '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';
        } else {
          console.log("TENGO AVATAR PROPIO"),usu.avatar;
          this.imageAvatar = usu.avatar;
          
        }
        this.name = usu.name;
        this.requestsService.getRequestStored().then((val)=>{
          if (val!==null) this.appPages[1] = { title: 'Login', url: '/auth/login', icon: 'contact' };
        });
      }
      
    });

  }



  logout() {
    this.authService.logout().then(() => {
      console.log("PROFILE_PAGE EJECUTADO EL LOGOUT");
      this.events.publish('user:loggedout');
    });

  }


  configurePages() {
    this.appPages = [
      { title: 'Home', url: '/home', icon: 'home' },
      { title: 'Profile', url: '/profile', icon: 'contact' },
      { title: 'Solicitudes', url: '/requests', icon: 'restaurant' }
    ];
  }

  configurePagesInit() {
    this.appPages = [
      { title: 'Home', url: '/home', icon: 'home' },
      { title: 'Login', url: '/auth/login', icon: 'contact' },
    ];
    this.imageAvatar = null;
    this.is_logged = false;
  }
}






