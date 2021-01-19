import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReserveFinishPage } from './reserve-finish.page';

const routes: Routes = [
  {
    path: '',
    component: ReserveFinishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveFinishPageRoutingModule {}
