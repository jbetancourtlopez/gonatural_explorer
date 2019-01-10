import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SignaturePage } from '../signature/signature';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

// Provider
import { DbProvider } from '../../providers/db/db';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-sheet',
  templateUrl: 'sheet.html',
})
export class SheetPage {

  public signatureImage_1 = "";
  public signatureImage_2 = "";
  sheet: string = "file_1";
  cupon: any;
  isAndroid: boolean = false;
  public observable_image_1 = new Subject<any>();
  public observable_image_2 = new Subject<any>();

  constructor(public navCtrl: NavController, public params: NavParams, platform: Platform, private db: DbProvider) {
    this.isAndroid = platform.is('android');
    this.signatureImage_1 = params.get('signatureImage_1');
    this.signatureImage_2 = params.get('signatureImage_2');

    this.cupon = params.get('cupon');

    this.observable_image_1.subscribe(val => {
      this.signatureImage_1 = val;
    })

    this.observable_image_2.subscribe(val => {
      this.signatureImage_2 = val;
    })
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SheetPage');

    console.log("Signature 1: " + this.signatureImage_1);
    console.log("Signature 2: " + this.signatureImage_2);
    
    if (typeof this.signatureImage_1 == "undefined" || this.signatureImage_1 == ""){
      this.db.cupon_select_id(this.cupon.idReservaDetalle).then(response => {
        //console.log("Signature 1: " + JSON.stringify(response));
        console.log("Signature 1: ");
        this.observable_image_1.next(response.signature_1);

      }).catch(error => JSON.stringify(error));
    }

    if (typeof this.signatureImage_2 == "undefined" || this.signatureImage_2 == ""){
      this.db.cupon_select_id(this.cupon.idReservaDetalle).then(response => {
        //console.log("Signature 2: " + JSON.stringify(response));
        console.log("Signature 2: ");

        this.observable_image_2.next(response.signature_2);

      }).catch(error => JSON.stringify(error));
    }
    
  }

  on_click_list(){
    this.navCtrl.setRoot(HomePage);
  }

  on_click_signature(number: number){
    this.navCtrl.push(SignaturePage, {option: number, cupon: this.cupon});
  }

}
