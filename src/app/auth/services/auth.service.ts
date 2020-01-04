import { Injectable, EventEmitter } from '@angular/core';
import { Request } from '../../requests/interfaces/request';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, switchMap} from 'rxjs/operators'
import { Observable, throwError, of, from } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';
import { environment } from '../../../environments/environment';
import { AccessCompany } from '../interfaces/accessCompany';
import { Company } from '../interfaces/company';
import { RequestsService } from '../../requests/services/requests.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverEVTC:string=environment.serverEVTC;
  urlAccess:string='/companies/access';
  urlCompany:string='/companies'
  urlAuth:string='/auth/login';
  readonly VALIDATE_URL = '/auth/validate';
  logged = false;
  loginChange$ = new EventEmitter<boolean>();
  
  
  //baseExtension:string=environment.baseExtension;
  //urlGetEncr=this.serverEVTC+this.baseExtension+"/companies/urlEncrypt";  // path to extract URL Server Company
  
  constructor(
    private storageService: StorageService,
    private requestsService: RequestsService,
    private http: HttpClient) { }

    


    private setLogged(logged: boolean) {
      this.logged = logged;
      this.loginChange$.emit(logged);
    }



    // Get url company to access their DDBB 
    getUrlAccess(codeCompany:Object): Observable<AccessCompany> {
      console.log("URL y CODECOMPANY DESDE AUTHSERVICE",this.serverEVTC+this.urlAccess,codeCompany);
      return this.http.post<{accessCompany:AccessCompany}>(this.serverEVTC+this.urlAccess,codeCompany)
      .pipe(
        map(resp=>resp['result']),
        catchError((resp:HttpErrorResponse) => throwError(`Error getting AccessCompany. Status: ${resp.status}. Message: ${resp.message} `))
      );
    }


    getCompany(url:string,codeCompany:string): Observable<Company> {
      console.log("CODECOMPANY",codeCompany,url+this.urlCompany);
      return this.http.post<{company:Company}>(url+this.urlCompany,{idCompany:codeCompany})
      .pipe(
        map(resp=>resp['result']),
        catchError((resp:HttpErrorResponse) => throwError(`Error getting Company. Status: ${resp.status}. Message: ${resp.message} `))
      );
    }

    login(accessCompany:AccessCompany, mapboxCode:string, username: string, password: string): Observable<void> {
      return this.http.post<{accessToken: string}>(accessCompany.urlCompany+accessCompany.pathAPI+this.urlAuth,{username,password}).pipe(
        switchMap(async r => { // switchMap must return a Promise or observable (a Promise in this case)
          try {
            console.log("TOKEN: ",r);
            if (r["error"]){
              throw new Error('Can\'t save authentication token in storage!');
            }else{
              console.log("TOKEN: ",r["result"]["token"]);
              await this.storageService.setParameters(accessCompany,mapboxCode,null,r["result"]["token"]);
            }
            /* await this.storage.set('fs-token', r["accessToken"]);
            this.setLogged(true); */
          } catch (e) {
            throw new Error('Can\'t save authentication token in storage!');
          }
        })
      );
    }


   

    getToken():Promise<string>{
      return this.storageService.getToken();
    }


      




  /* 
    accessWithRequest(accessCompany:AccessCompany, mapboxCode:string,idRequest:string){
      console.log("VALORES EN AUTHSERVICE ACCESS WITH REQUEST",accessCompany,mapboxCode,idRequest);
      this.requestsService.getRequests(accessCompany, idRequest).subscribe(async (req) => {
        console.log("REQUEST EN AUTH SERVICE ACCESSWITHREQUEST;",req);
        await this.storageService.setParameters(accessCompany, mapboxCode,req[0],null);
        return of();
        });
       
    }
     */

    isLogged(accessCompany:AccessCompany): Observable<boolean> {
      if (this.logged) { return of(true); }
      return from(this.storageService.getToken()).pipe(
        switchMap(v => {
          if (!v) { throw new Error(); }
          return this.http.get(accessCompany.urlCompany+accessCompany.pathAPI+this.VALIDATE_URL).pipe(
            map(() => {
              this.setLogged(true);
              return true;
            }), catchError(error => of(false))
          );
        }),
        catchError(e => of(false))
      );
    }
  
  


    logout(): Promise<void> { 
      this.setLogged(false);
      return this.storageService.removeParameters();
     
    }
  







    hasRequest():Promise<boolean>{
      return this.storageService.getRequest().then((resp)=> {
        console.log("HAS RESQUEST: ",resp);
        return (resp!==null?true:false);
      });
    }

    isRequestStored():Promise<boolean>{
      return this.storageService.getRequest().then((resp)=> {
        return (resp!==null?true:false);
      });
    }


    
}
