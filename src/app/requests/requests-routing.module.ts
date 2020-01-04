import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ 
  { path: '', loadChildren: './requests-list/requests-list.module#RequestsListPageModule' },
  { path: 'details/:id', loadChildren: './request-details/request-details.module#RequestDetailsPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
