import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanteenPageRoutingModule } from './canteen-routing.module';
import { ComponentsModule } from '../components/components.module';
import { CanteenPage } from './canteen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CanteenPageRoutingModule
  ],
  declarations: [CanteenPage]
})
export class CanteenPageModule {}
