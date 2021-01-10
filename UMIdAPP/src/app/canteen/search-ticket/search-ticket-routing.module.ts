import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchTicketPage } from './search-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: SearchTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchTicketPageRoutingModule {}
