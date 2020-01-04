import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MapComponent } from 'ngx-mapbox-gl';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';// Updating node module will keep css up to date.
import { Request } from '../../interfaces/request';
import { Events, ModalController, ToastController } from '@ionic/angular';
import { RequestsService } from '../../services/requests.service';
import { AccessCompany } from "../../../auth/interfaces/accessCompany";
import { Comment } from '../../interfaces/comment';
import { NewCommentComponent } from './new-comment.component';

@Component({
  selector: 'app-request-comments',
  templateUrl: './request-comments.page.html',
  styleUrls: ['./request-comments.page.scss'],
})
export class RequestCommentsPage {
  driverId:string;
  comments: Comment[] = [];
  request: Request;
  commentsToShow: Comment[] = [];
  items: String[] = [];
  num = 0;
  finished = false;

  

 

  //user: User;

  constructor(
    private events: Events,
    private requestsService: RequestsService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
    ) {
    console.log("CONTRUCTOR EN COMENTS PAGE");
    /* this.events.subscribe('request', request => {
      this.request = request;
      console.log("REQUEST EN COMENTS PAGE EN CONSTRUCTOR: ", this.request);
      this.driverId=this.request.driver.id;
    }); */
  }



  ionViewWillEnter() {
    console.log("ION VIEW en coments");
    this.events.subscribe('request', request => {
      this.request = request;
      console.log("REQUEST EN COMENTS PAGE en IONVIEWWILLENTER: ", this.request);
      this.driverId=this.request.driver.id;
      console.log("REQUEST",this.request); 
    this.update();
    });
    
  }


  ionViewWillUnload() {
    this.events.unsubscribe('request');
  }


  loadMoreItems(event) {

    let max = this.num + 12;
    max = max > this.comments.length ? this.comments.length : max;

    // Simulating an external service call with a timeout
    setTimeout(() => {

      for (; this.num < max; this.num++) {

        this.commentsToShow.push(this.comments[this.num]);

      }
      if (this.num >= this.comments.length) { // We'll load a maximum of 60 items
        this.finished = true;
      }
      if (event !== null) {
        event.target.complete(); // Hide the loader
      }
    }, event === null ? 0 : 2000);
  }

  refresh(event) {
    //this.update();
    event.target.complete();

  }


 
  async showToast(time: number, message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: time, // 2 seconds
      position: 'middle',
      color: 'dark'
    });

    await toast.present();
  }



  async openNewComment() {
    console.log("THIS REQUEST WHEN ADD COMMENT:",this.request);
    let comp:AccessCompany= await this.requestsService.getAccessCompany();
    
     const modal = await this.modalCtrl.create({
      component: NewCommentComponent,
      componentProps: { accessCompany: comp,
                        requestId:this.request.id,
                        userName:this.request.user.username }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data.changed) {
      this.update();
      this.showToast(3000, 'Comment added sucessfully!');
    } 
  }



  async update() {
    let comp:AccessCompany= await this.requestsService.getAccessCompany();
    console.log("DRIVER DESDE UPDATE DE REQUEST COMMENTS",this.driverId);
    this.requestsService.getComments(comp,this.driverId)
        .subscribe(
          comments => {
            this.comments = comments;
            console.log("COMMENTS RM RESQUESTCOMMENTS PAGE..",comments)
            this.loadMoreItems(null);
          },
          error => console.error(error),
          () => {
            console.log('Comments loaded');
            console.log("COMMENTS: ",this.comments);
          }
        );
  }


 

  




  

}






