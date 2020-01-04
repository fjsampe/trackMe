import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestDetailsPage } from './request-details.page';

const routes: Routes = [
  {
    path: '',
    component: RequestDetailsPage,
    children: [
      { 
        path: 'info', 
        children:[
          {
            path:'',
            loadChildren: './request-info/request-info.module#RequestInfoPageModule' 
          }
        ]
        
      },
      { 
        path: 'map', 
        children:[
          {
            path:'',
            loadChildren: './request-map/request-map.module#RequestMapPageModule'
          }
        ]
      },
      { 
        path: 'comments',
        children:[
          {
            path:'',
            loadChildren: './request-comments/request-comments.module#RequestCommentsPageModule' 
          }
        ]
      },
      { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'info'
      }
    ]
  }

];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RequestDetailsPage]
})
export class RequestDetailsPageModule {}
