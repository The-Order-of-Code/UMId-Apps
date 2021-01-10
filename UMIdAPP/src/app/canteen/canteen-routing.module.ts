import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanteenPage } from './canteen.page';

const routes: Routes = [
  {
    path: '',
    component: CanteenPage
  }, 
  { 
    path: 'search-ticket',
    loadChildren: () => import('./search-ticket/search-ticket.module').then( m => m.SearchTicketPageModule)
  },
  {
    path: 'buy-ticket',
    loadChildren: () => import('./buy-ticket/buy-ticket.module').then( m => m.BuyTicketPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanteenPageRoutingModule {}
