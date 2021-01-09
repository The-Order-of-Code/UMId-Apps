import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanteenPage } from './canteen.page';

const routes: Routes = [
  {
    path: '',
    component: CanteenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanteenPageRoutingModule {}
