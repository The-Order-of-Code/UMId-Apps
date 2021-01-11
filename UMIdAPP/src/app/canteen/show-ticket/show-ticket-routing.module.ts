import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTicketPage } from './show-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: ShowTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowTicketPageRoutingModule {}
