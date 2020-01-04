import { Input, Component, ViewChild, NgZone } from '@angular/core';
import { ModalController, ToastController, Events, NavController } from '@ionic/angular';
import { StarRatingComponent } from '../../../shared/star-rating/star-rating.component';
import { RequestsService } from '../../services/requests.service';
import { Comment } from '../../interfaces/comment';
import { User } from '../../../users/interfaces/user';
import { AccessCompany } from 'src/app/auth/interfaces/accessCompany';
import { NumberSymbol } from '@angular/common';


@Component({
    selector: 'app-popover-content',
    template: `
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Comment</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-list-header>USER: {{userName}}</ion-list-header>
          <ion-item>
              <ion-label position="floating">Comment</ion-label>
              <ion-textarea name="comment" [(ngModel)]="comment" required #commentModel="ngModel" placeholder="Your comments" rows="4"></ion-textarea>
          </ion-item>


          <app-star-rating [rating]="rating" (changeRating)="changeRating($event)"></app-star-rating>


          

          
            <ion-button [disabled]="commentModel.invalid || !commentModel.dirty" (click)="addComment()" 
                                  >Add</ion-button>
            <ion-button color="danger" (click)="cancel()">Cancel</ion-button>
            
         
          
        </ion-list>
      </ion-content>
    `
})




export class NewCommentComponent {

  @Input()
  //idDriver: number;
  
  rating:number=1;
  requestId:number;
  userName:string;
  accessCompany: AccessCompany;
  @ViewChild('StarRatingComponent',null) rate: StarRatingComponent ;
  comment: string;
  
  newComment:Comment = {
    text: '',
    stars:1
  };

  

  constructor(
    private modalCtrl: ModalController,
    //public userServ: UsersService,
    private toastCtrl: ToastController,
    private requestsService: RequestsService,
    private nav: NavController,
    private ngZone: NgZone
    
    ) {}


  

  async showToast(time: number, message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: time, // 2 seconds
      position: 'middle',
      color: 'dark'
    });

    await toast.present();
  }


   addComment() {
     this.newComment.text=this.comment;
     this.newComment.stars=this.rating;
     this.requestsService.addComment(this.accessCompany,this.requestId,this.newComment)
      .subscribe(
        comment => {
          console.log("COMMENT ADD EN NEW COMMENT COMPONENT: ",comment);
          this.modalCtrl.dismiss({ changed: true});
        },
        error => {

          console.log("ERROR ADD EN NEW COMMENT COMPONENT: ",error);
          this.showToast(3000, "Error adding comment");
          this.cancel();
        }

      );
    /* this.userServ.changeInformation(this.name,this.email)
      .subscribe(
        ok => {this.modalCtrl.dismiss({ 
          changed: true, 
          newName: this.name,
          newEmail: this.email });
          },
        error => this.showToast(3000, error)
      ); */ 



/* 
      this.productService.addProduct(this.newProd).subscribe(
        async prod => {
          (await this.toastCtrl.create({
            position: 'bottom',
            duration: 3000,
            message: 'Product added succesfully',
            color: 'success'
          })).present();
          this.nav.navigateRoot(['/products']);
        },
        async error => (await this.toastCtrl.create({
          position: 'bottom',
          duration: 3000,
          message: 'Error adding product'
        })).present()
 */




  } 

  cancel() {
    this.modalCtrl.dismiss({ changed: false });
  }


  changeRating(newRating) {
    this.rating=newRating;
  }



}











