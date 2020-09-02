import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    FormsModule,
    NgZorroAntdMobileModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
