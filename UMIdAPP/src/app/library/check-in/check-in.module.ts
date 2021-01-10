import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckInPageRoutingModule } from './check-in-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { CheckInPage } from './check-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CheckInPageRoutingModule
  ],
  declarations: [CheckInPage]
})
export class CheckInPageModule {}
