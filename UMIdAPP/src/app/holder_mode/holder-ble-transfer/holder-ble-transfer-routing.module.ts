import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolderBleTransferPage } from './holder-ble-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: HolderBleTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolderBleTransferPageRoutingModule {}
