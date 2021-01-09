import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextReservationsPage } from './next-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: NextReservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextReservationsPageRoutingModule {}
