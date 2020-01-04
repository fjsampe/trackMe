import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { 
    path: 'requests', 
    loadChildren: './requests/requests.module#RequestsModule', 
    //canActivate: [LoginActivateGuard] 
  },
  { 
    path: 'auth', 
    loadChildren: './auth/auth.module#AuthModule', 
    //canActivate: [LogoutActivateGuard] 
  },
  { path: 'profile', loadChildren: './users/users.module#UsersModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
