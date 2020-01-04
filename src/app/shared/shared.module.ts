import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [StarRatingComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    StarRatingComponent
  ]
})
export class SharedModule { }
