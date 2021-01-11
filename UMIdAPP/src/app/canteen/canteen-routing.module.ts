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
  },
  {
    path: 'show-ticket',
    loadChildren: () => import('./show-ticket/show-ticket.module').then( m => m.ShowTicketPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanteenPageRoutingModule {}
