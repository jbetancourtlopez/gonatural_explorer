import {Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { GlobalProvider } from "../../providers/global/global";
import { DbProvider } from '../../providers/db/db';
import { isRightSide } from 'ionic-angular/umd/util/util';

import { LoginPage} from '../../pages/login/login'



@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  @ViewChild(Nav) nav: Nav;

  data = {
    Guia:"",
    Vehiculo:"gg ",
    Transportadora:"",
    idGuia:"",
    chofer:"",
    obs:"",
    rfc:"",
    razon:"",
    dir:"",
    licencia:"",
    tour:""
  };

  constructor(public navCtrl: NavController,  private db: DbProvider, public navParams: NavParams, private server: ServerProvider, public loadingCtrl: LoadingController, public global: GlobalProvider) {
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad BoardPage');
    var loader = this.loadingCtrl.create({
      content: 'Recuperando datos... Espere.'  });
    loader.present();
      
    this.db.orden_select().then((response: any) =>{
      console.log(response);
      if (!response){
        this.navCtrl.push(LoginPage, {});
      }else{
        this.data = response;
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
    loader.dismiss();
  }

}
