import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SheetPage } from './sheet';

@NgModule({
  declarations: [
    SheetPage,
  ],
  imports: [
    IonicPageModule.forChild(SheetPage),
  ],
})
export class SheetPageModule {}
