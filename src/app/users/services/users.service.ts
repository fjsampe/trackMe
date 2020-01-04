import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../interfaces/user';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { StorageService } from '../../services/storage/storage.service';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  serverEVTC:string=environment.serverEVTC;
  urlProfile:string='/users';
  urlAuth:string='/auth/validate';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer) { 
  }

  getProfile(accessCompany: AccessCompany,id = null): Observable<User> {
    console.log("ACCESS COMPANY EN USERS SERVICE GET PROFILE",accessCompany);
    let url = id === null ? this.urlProfile+'/me' : this.urlProfile + `/${id}`;
    url=accessCompany.urlCompany+accessCompany.pathAPI+url;
    console.log("URL:", url);



    return this.http.get<{ user: User }>(url)
      .pipe(
        map(resp => {

          
          console.log("RESP DESDE USERSERVICE..",resp);
          let user = resp.user;
          if (user!==undefined && user!==null){

             user.avatar = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+user.avatar);
          }
          console.log("USER ACTUAL: ", user);
          return user;
        }),
        catchError((resp: HttpErrorResponse) => throwError(`Error getting requests. Status: ${resp.status}. Message: ${resp.message} `))
      );
      
  }

  
}
