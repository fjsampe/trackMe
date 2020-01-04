import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';
import { User } from '../../users/interfaces/user';
import { environment } from '../../../environments/environment';
import { Request } from '../../requests/interfaces/request';
import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { Configuration } from '../../requests/interfaces/configuration';

const CNF_KEY = 'evtc-trackMe';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }


  setParameters(accessCompany:AccessCompany, mapboxCode: string, idRequest:number,token:string): Promise<void> {
    console.log ("#######################");
    console.log ("# GRABANDO PARAMETERS #");
    console.log ("#######################");
    
    console.log("VALORES: ",accessCompany,mapboxCode,idRequest,token);
    return this.storage.set(CNF_KEY,
      {
        accessCompany: accessCompany,
        mapboxCode: mapboxCode,
        idRequest: idRequest,
        token:token
      }
    );
  }

  async saveRequest(idRequest:number):Promise<void>{
    console.log ("#################");
    console.log ("#  GRABANDO ID  #");
    console.log ("#################");
    
    let conf=await this.getParameters();
    return this.storage.set(CNF_KEY,
      {
        accessCompany: conf.accessCompany,
        mapboxCode: conf.mapboxCode,
        request:idRequest,
        token:conf.token
      });
  }

  getParameters():Promise<Configuration>{
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp !== null ? resp : null;
    });
  }

  getRequest(): Promise<Request> {
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp !== null ? resp.request : null;
    });
  }

  getMapboxCode(): Promise<string>{
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp !== null ? resp.mapboxCode : null;
    });

  }

  getAccessCompany():Promise<AccessCompany>{
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp !== null ? resp.accessCompany : null;
    });
  }

  getRequestId(): Promise<number>{
    return this.storage.get(CNF_KEY).then((resp)=> {
      return resp !==null ? resp.request : null;
    });
  }

  
  getToken(): Promise<string>{
    return this.storage.get(CNF_KEY).then((resp)=> {
      return resp.token !==null ? resp.token : null;
    });
  }

  
  removeParameters():Promise<void>{
    console.log ("#################");
    console.log ("#   BORRANDO    #");
    console.log ("#################");
    return this.storage.remove(CNF_KEY);
  }
  




  /* 
  getUrlBase(): Promise<string> {
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp !== null ? resp.url : null;
    });
  }




  getUrlRequest(): Promise<string> {
    return this.getUrlBase().then(url => {
      return this.getRequest().then(req => url + "/request/" + req)
    });
  }



  getMapboxCode(): Promise<string> {
    return this.storage.get(CNF_KEY).then((resp) => {
      return resp.mapboxCode !== null ? resp.mapboxCode : null;
    });
  }

  getUser(req: Request): Promise<User> {
    return undefined;
  }

 */


}
