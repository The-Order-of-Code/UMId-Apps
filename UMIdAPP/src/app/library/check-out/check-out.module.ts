import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckOutPageRoutingModule } from './check-out-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { CheckOutPage } from './check-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CheckOutPageRoutingModule
  ],
  declarations: [CheckOutPage]
})
export class CheckOutPageModule {}
