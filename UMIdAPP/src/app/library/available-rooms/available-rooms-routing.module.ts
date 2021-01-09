import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableRoomsPage } from './available-rooms.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableRoomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableRoomsPageRoutingModule {}
