import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage
  },
  {
    path: 'available-rooms',
    loadChildren: () => import('./available-rooms/available-rooms.module').then( m => m.AvailableRoomsPageModule)
  },
  {
    path: 'next-reservations',
    loadChildren: () => import('./next-reservations/next-reservations.module').then( m => m.NextReservationsPageModule)
  },
  {
    path: 'check-in',
    loadChildren: () => import('./check-in/check-in.module').then( m => m.CheckInPageModule)
  },
  {
    path: 'check-out',
    loadChildren: () => import('./check-out/check-out.module').then( m => m.CheckOutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
