import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { Request } from '../interfaces/request';
import { StorageService } from '../../services/storage/storage.service';
import { map, catchError } from 'rxjs/operators';
//import { AuthService } from '../../auth/services/auth.service';
import { Frame } from '../interfaces/frame';
import { User } from '../../users/interfaces/user';
import { environment } from '../../../environments/environment';
import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { Comment } from '../interfaces/comment';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';



enum statusRequest {
  pending = 0,
  pickUp = 1,
  started = 2,
  finish = 4
};


@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  readonly status:string[]=['Pendiente','PickUp','Iniciado','Terminado'];

  //baseExtension: string = environment.baseExtension;
  urlRequest: string = "/requests";
  urlComments: string = "/drivers";
  /*  serverEVTC:string=environment.serverEVTC;
   baseExtension:string=environment.baseExtension;
   urlGetEncr=this.serverEVTC+this.baseExtension+"companies/urlEncrypt";  // path to extract URL Server Company
    */

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private sanitizer: DomSanitizer
    //private authService: AuthService
  ) { }

  getRequests(accessCompany: AccessCompany, idRequest: string = null): Observable<Request[]> {
    console.log("DATOS EN REQUESTSERVICE GETREQUESTS: ",accessCompany,idRequest);
    let urlRequests = idRequest!==null?accessCompany.urlCompany+accessCompany.pathAPI + this.urlRequest + "/" + idRequest:accessCompany.urlCompany+accessCompany.pathAPI+this.urlRequest;
    console.log("URL EN REQUESTSERVICE GETREQUESTS: ",urlRequests)
    return this.http.get<{ requests: Request[] }>(`${urlRequests}`)
      .pipe(map(resp => resp.requests.map(r => {
        console.log("R LEIDO EN REQUESTSERVICE GETREQUEST:",r);
        r.car.image = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+r.car.image);
        r.driver.image = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+r.driver.image);
        r.user.avatar = r.user.avatar;
        r.status=this.status[+r.status];        
        return r;
      }),
      catchError((resp: HttpErrorResponse) => throwError(`Error getting requests. Status: ${resp.status}. Message: ${resp.message} `))
    ));
  }


  getRequestById(accessCompany: AccessCompany, idRequest: number):Observable<Request>{
    console.log("DATOS EN REQUESTSERVICE GETREQUESTS: ",accessCompany,idRequest);
    let urlRequest = accessCompany.urlCompany+accessCompany.pathAPI + this.urlRequest + "/" + idRequest
      return this.http.get<{request: Request}>(`${urlRequest}`)
        .pipe(
          map(resp => {
            console.log("RESP EN GETREQUEST BY ID EN REQUEST SERVICE",resp);
            resp.request[0].car.image=this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+resp.request[0].car.image);
            resp.request[0].driver.image = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+resp.request[0].driver.image);
            return resp.request[0]})
        );
    }
  

    getComments(accessCompany: AccessCompany,idDriver: string):Observable<Comment[]>{
      let urlRequest = accessCompany.urlCompany+accessCompany.pathAPI + this.urlComments + "/" + idDriver+"/comments";
    
      return this.http.get<{comments: Comment[]}>(`${urlRequest}`)
      .pipe(map(resp => resp.comments.map(r => {
        console.log("R LEIDO EN REQUESTSERVICE GETCOMMENTS:",r);
          r.user.avatar = this.sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+r.user.avatar);
          return r;
      }),
      catchError((resp: HttpErrorResponse) => throwError(`Error getting requests. Status: ${resp.status}. Message: ${resp.message} `))
    ));
  }


  addComment(accessCompany: AccessCompany,requestId:number, newComment:Comment){
    let urlRequest = accessCompany.urlCompany+accessCompany.pathAPI + this.urlComments + "/" + requestId+"/comments";
    
    return this.http.post<{comment: Comment}>((`${urlRequest}`), newComment)
      .pipe(map(resp => {
        
        console.log("RESP EN REUQEST SERVICE ADD COMMENT ",resp);
        if (resp["error"]===true){
          console.log ("EEROR DESDE REQUEST SERVICE ADD COMMENT");
          return resp["error"];
        }else{
          console.log ("NO EEROR DESDE REQUEST SERVICE ADD COMMENT");
          return(resp.comment);
        }
        
      }),
      catchError((resp: HttpErrorResponse) => throwError(`Error getting requests. Status: ${resp.status}. Message: ${resp.message} `))
      );
  }





  saveRequest(request:number):Promise<void>{
    return this.storageService.saveRequest(request);
  }


  getRequestStored():Promise<Request>{
    return this.storageService.getRequest();
  }

  getMapboxCode(): Promise<string> {
    return this.storageService.getMapboxCode();
  }


  getAccessCompany():Promise<AccessCompany>{
    return this.storageService.getAccessCompany();
  }

  getRequestId():Promise<number>{
    return this.storageService.getRequestId();
  }





    getLastPosition(urlAPI:string):Observable<Frame>{
      return this.http.get<{ frame: Frame }>(urlAPI)
      .pipe(
        map(resp => {
          console.log("RESP....",resp);
          console.log("RESP FRAME", resp['result'][0]);
          return resp['result'][0];
        }),
        catchError((resp: HttpErrorResponse) => throwError(`Error getting last Tick. Status: ${resp.status}. Message: ${resp.message} `))
      );
    }
  
    
  }


