import { Component, OnInit } from '@angular/core';
import { Request } from '../interfaces/request';
import { Events } from '@ionic/angular';
import { RequestsService } from '../services/requests.service'; 
import { ActivatedRoute } from '@angular/router';
import { AccessCompany } from '../../auth/interfaces/accessCompany';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.page.html',
  styleUrls: ['./request-details.page.scss'],
})
export class RequestDetailsPage implements OnInit {
  request: Request;
  mapboxCode: string;
 // urlTicks:string;
  constructor(
    private events: Events,
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    ) { }

  async ngOnInit() {
    let accessCompany:AccessCompany = await this.requestsService.getAccessCompany();
    
    this.requestsService.getMapboxCode().then((code)=>{this.mapboxCode=code});
    this.requestsService.getRequestById( accessCompany  ,this.route.snapshot.params.id).subscribe(
      req=>{
        this.request=req;
        console.log("REQUEST DESDE REQUEST_DETAILS-PAGE: ",this.request);
        this.events.publish('request', this.request);
    });
    // Si catch entones tengo que leer el request ID correspondiente, ya que no se almacena nada
    


    // GET REQUEST
    /* this.requestsService.getUrlRequest().then((url)=>{
      this.requestsService.getRequest(url,this.route.snapshot.params.id).subscribe(
        request => {
          this.request = request;
          console.log("**DETALLES** SIEMPRE CARGO EL REQUEST y EJECUTO EVENTS.PUBLISH request: ");
          this.events.publish('request', this.request);
        }
      );
    });

    // GET MAPBOX CODE
    this.requestsService.getMapboxCode().then((code)=>{
      this.mapboxCode = code;
      //this.events.publish('mapboxCode', this.mapboxCode);
    }); */

   /*  // GET URL TICKs CAR
    this.requestsService.getUrl().then((url) => {
      this.urlTicks=url;
    }); */
  }


  tabsChange(events) {
    if (events.tab === 'info' || events.tab === 'map' || events.tab==='comments') {
      
      if (this.request!==undefined) {
        this.events.publish('request', this.request);
        console.log("**DETALLES** CLICK EN TAB y EJECUTO EVENTS.PUBLISH request ");
      } 
      if (this.mapboxCode!==undefined) {
        this.events.publish('mapboxCode', this.mapboxCode);
        console.log("**DETALLES** CLICK EN TAB y EJECUTO EVENTS.PUBLISH mapboxCode ");
      }
      /* if (this.urlTicks!==undefined) {
        this.events.publish('urlTicks', this.urlTicks);
        console.log("**DETALLES** CLICK EN TAB y EJECUTO EVENTS.PUBLISH urlTicks  ");
      }  */
    }

  }
}


