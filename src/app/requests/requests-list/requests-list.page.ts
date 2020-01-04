import { Component, OnInit } from '@angular/core';
import { Request } from '../interfaces/request';
import { RequestsService } from '../services/requests.service'
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

enum statusRequest {
  pending = 0,
  pickUp = 1,
  started = 2,
  finish = 4
};

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.page.html',
  styleUrls: ['./requests-list.page.scss'],
})
export class RequestsListPage implements OnInit {
  
  requests: Request[] = [];
  requestsToShow: Request[] = [];
  num=0;
  finished = false;
  readonly status:string[]=['Pendiente','PickUp','Iniciado','Terminado'];
  displayImage:SafeUrl=null;
  

  constructor(
    private requestsService: RequestsService,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    console.log("ENTRO A REQUEST LIST");
    // ESTO FUNCIONA..
    /* this.requestsService.getRequest().then((req)=>{
        this.requests.push(req);
        this.requestsToShow.push(req);
      });
 */

      let comp:AccessCompany= await this.requestsService.getAccessCompany();
      console.log("ACCESS COMPANY en request list",comp);
      let id:number= await this.requestsService.getRequestId();
      console.log("ID",id);
      if (id!==null){
        
        //Logado with request. Only 1 request
        this.requestsService.getRequestById(comp,id).subscribe((req)=>{
          //this.displayImage = req.car.image;
          //req.car.image= "data:image/jpeg;base64,"+req.car.image;
          //console.log("REQUESTS....",req.car.image);

        this.requests.push(req);
        this.requestsToShow.push(req);
        this.requestsService.saveRequest(req.id).then(()=>console.log("HOLA GRABANDO REQUEST"));
        
      });
      }else{
        this.requestsService.getRequests(comp).subscribe((req)=>{
          console.log("REQUESTS....",req);
          this.requests=req;
          
          this.loadMoreItems(null);

      });
    }
  }



  loadMoreItems(event) {
    console.log("NUM: ",this.num,this.requests.length);
    let max = this.num + 12;
    max=max>this.requests.length?this.requests.length:max;
       console.log("ENTRAMOS EN LOADMORE, maximo",max);
    console.log("this.requests",this.requests);
 
    // Simulating an external service call with a timeout
    setTimeout(() => {
      for (; this.num < max; this.num++) {
        this.requestsToShow.push(this.requests[this.num]);
      }
      console.log("THIS TO SHOW",this.requestsToShow);
      if (this.num >= this.requests.length) { // We'll load a maximum of 60 items
        this.finished = true;
      }
      console.log("NUM y MAX",this.num,max);
      if (this.num<=max) this.num=0;
      if (event !== null) {
        event.target.complete(); // Hide the loader
      }
    }, event === null ? 0 : 2000);
  }


  async showOptions(req: Request) {
    let actSheet:HTMLIonActionSheetElement;
   
        actSheet = await this.actionSheetCtrl.create({
          header: 'SOLICITUD: '+req.id,
          buttons: [ {
            text: 'See details',
            icon: 'eye',
            handler: () => {
              this.router.navigate(['/requests/details', req.id]);
            }
          }, {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
          }]
        });
      
      actSheet.present();
    }



  refresh(event) {
    this.requests=[];
    this.requestsToShow=[];
    this.ngOnInit();
      event.target.complete();
  }


}
