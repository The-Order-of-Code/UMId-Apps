import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsFinishPage } from './payments-finish.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsFinishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsFinishPageRoutingModule {}
