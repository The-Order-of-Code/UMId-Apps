import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { ComponentsModule } from '../components/components.module';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  providers: [MenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
