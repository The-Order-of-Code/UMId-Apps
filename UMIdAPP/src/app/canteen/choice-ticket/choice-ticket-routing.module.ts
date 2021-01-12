import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoiceTicketPage } from './choice-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: ChoiceTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoiceTicketPageRoutingModule {}
