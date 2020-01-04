import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { RequestCommentsPage } from './request-comments.page';
import { SharedModule } from '../../../shared/shared.module';

import { MaskUsernamePipe } from '../../../pipes/mask-username.pipe';
import { NewCommentComponent } from './new-comment.component';

const routes: Routes = [
  {
    path: '',
    component: RequestCommentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxMapboxGLModule
  ],
  declarations: [RequestCommentsPage, MaskUsernamePipe,NewCommentComponent],
  entryComponents: [NewCommentComponent]
})
export class RequestCommentsPageModule {}
