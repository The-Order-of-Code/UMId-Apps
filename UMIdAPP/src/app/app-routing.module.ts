import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./reader_mode/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'instructions',
    loadChildren: () => import('./reader_mode/pages/instructions/instructions.module').then( m => m.InstructionsPageModule)
  },
  {
    path: 'pin-auth',
    loadChildren: () => import('./reader_mode/pages/pin-auth/pin-auth.module').then( m => m.PinAuthPageModule)
  },
  {
    path: 'card-page',
    loadChildren: () => import('./card-page/card-page.module').then( m => m.CardPagePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
