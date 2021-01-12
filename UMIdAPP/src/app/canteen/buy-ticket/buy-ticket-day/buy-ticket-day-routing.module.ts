import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyTicketDayPage } from './buy-ticket-day.page';

const routes: Routes = [
  {
    path: '',
    component: BuyTicketDayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyTicketDayPageRoutingModule {}
