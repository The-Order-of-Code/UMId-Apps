import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderBleTransferPage } from './reader-ble-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderBleTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderBleTransferPageRoutingModule {}
