import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PinAuthPage } from './pin-auth.page';

const routes: Routes = [
  {
    path: '',
    component: PinAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinAuthPageRoutingModule {}
