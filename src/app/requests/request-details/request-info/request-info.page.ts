import { Component, OnInit } from '@angular/core';
import { Request } from '../../interfaces/request';
import { Events, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-request-info',
  templateUrl: './request-info.page.html',
  styleUrls: ['./request-info.page.scss'],
})

export class RequestInfoPage {
  request: Request;
  constructor(
    private events: Events,
    private alertCrl: AlertController,
    private nav: NavController
  ) { 
      console.log("CONTRUCTOR EN INFO PAGE");
      this.events.subscribe('request', request => {
        this.request = request;
        this.request.driver.stars=Math.round(this.request.driver.stars);
        console.log("REQUEST EN INFO PAGE: ",this.request);
      }); 
  }

  ionViewWillUnload(){
    this.events.unsubscribe('request');
  }

}
