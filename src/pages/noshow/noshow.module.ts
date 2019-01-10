import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoshowPage } from './noshow';

@NgModule({
  declarations: [
    NoshowPage,
  ],
  imports: [
    IonicPageModule.forChild(NoshowPage),
  ],
})
export class NoshowPageModule {}
