import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyTicketPage } from './buy-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: BuyTicketPage
  },
  {
    path: 'buy-ticket-day',
    loadChildren: () => import('./buy-ticket-day/buy-ticket-day.module').then( m => m.BuyTicketDayPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./information/information.module').then( m => m.InformationPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyTicketPageRoutingModule {}
