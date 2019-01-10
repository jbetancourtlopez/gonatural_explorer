import { Component } from '@angular/core';
import { App, NavController, Events, AlertController, ModalController, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';

//Pages
import { BoardPage} from '../board/board';
import { NoshowPage } from '../noshow/noshow';
import { ChangecuponPage } from '../changecupon/changecupon';
import { ChangepersonPage } from '../changeperson/changeperson';
import { BoardsincuponPage } from '../boardsincupon/boardsincupon';
import { SheetPage} from '../sheet/sheet';
import { SyncPage } from '../sync/sync';
import { LoginPage} from '../../pages/login/login'

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { DbProvider } from '../../providers/db/db';
import { GlobalProvider } from "../../providers/global/global";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //private list_customer: Observable<any[]>;
  list_customer: any[] = [];
  public observable_list_customer = new Subject<any>();

  constructor(public navCtrl: NavController, public events: Events, private db: DbProvider, public modalCtrl: ModalController, private server: ServerProvider, public loadingCtrl: LoadingController, public global: GlobalProvider) {
    
    this.observable_list_customer.subscribe((response:any[]) => {
      this.list_customer = response;
    })
  }

  ionViewDidLoad() {
    this.events.publish('user:get_data_user');
    this.load_data();
  }

  on_click_update(){
    this.load_data();
  }



  load_data(){
    var loader = this.loadingCtrl.create({
      content: 'Recuperando datos... Espere.'  });
    loader.present();
      
    this.db.cupones_select().then((response:any[]) =>{    
      setTimeout(() => { // Only for demonstration purpose
        this.observable_list_customer.next(response);
        loader.dismiss();
      }, 100);
      
    }).catch(e => { console.log(JSON.stringify(e)); });
  }

  on_click_entry(cupon : any){

    var where_ = Array(
      { "key": "idOpVehi", "value": cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": cupon.idReservaDetalle },
    );

    var hour = this.global.get_hour_current();

    var update = Array(
      { "key": "pickUpIn", "value":  "'" + hour + "'" },
      { "key": "is_sinc_pickups", "value": "'" + 0  + "'"}
    );

    this.db.cupones_update(update, where_);
    this.load_data();

  }

  on_click_exit(cupon : any){
    var where_ = Array(
      { "key": "idOpVehi", "value": cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": cupon.idReservaDetalle },
    );

    var hour = this.global.get_hour_current();
    var update = Array(
      { "key": "pickUpOut", "value": "'" + hour + "'" },
      { "key": "is_sinc_pickups", "value": "'" + 0  + "'"}
    );

    this.db.cupones_update(update, where_);
    this.load_data();
  }

  pressEvent(cupon) {
    let modal = this.modalCtrl.create(ModalContentPage, {cupon: cupon});
    modal.present();
  }

  on_clik_sync(){
    this.navCtrl.setRoot(SyncPage);
  }

}

// Modal
@Component({
  templateUrl: 'modal-action.html'
})
export class ModalContentPage {
  cupon: any;

  constructor(public navCtrl: NavController, private db: DbProvider, private server: ServerProvider, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public appCtrl: App, public alertCtrl: AlertController) {
    this.cupon = params.get('cupon');
  }

  on_click_board() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(BoardPage, {cupon: this.cupon});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  on_click_noshow(){
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(NoshowPage, {cupon: this.cupon});
  }

  on_click_changecupon(){
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(ChangecuponPage, {cupon: this.cupon});
  }

  on_click_changeperson(){
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(ChangepersonPage, {cupon: this.cupon});
  }

  on_click_boardsincupon(){
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(BoardsincuponPage, {cupon: this.cupon});
  }

  on_click_sheet(){
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(SheetPage, {cupon: this.cupon});
  }

  on_click_reset(){
    const confirm = this.alertCtrl.create({
      title: 'Restablecer a Pendiente',
      message: 'El estatus actual del cupón se cambiara a Pendiente. ¿Estas de acuerdo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            var where_ = Array(
              { "key": "idOpVehi", "value": this.cupon.idOpVehi },
              { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
              { "key": "idDetalleOpVehi", "value": this.cupon.idDetalleOpVehi },
            );

       
              
            var update = Array(
              { "key": "status", "value": 1 }, 
              { "key": "numAdultos", "value": this.cupon.numAdultos_bk }, 
              { "key": "numNinos", "value": this.cupon.numNinos_bk }, 
              { "key": "numInfantes", "value": this.cupon.numInfantes_bk},   
              {"key": "is_sinc_board", "value": 1},
              {"key": "is_sinc_board_sin_cupon", "value": 1},
              {"key": "is_sinc_change_cupon", "value": 1},
              {"key": "is_sinc_change_person", "value": 1},
              {"key": "is_sinc_no_show", "value": 1},
              {"key": "is_sinc_pickups", "value": 1},
              {"key": "is_sinc_signature", "value": 1}          
            );
        
            this.db.cupones_update(update, where_);
          }
        }
      ]
    });
    confirm.present();
  }

  on_click_closed(){
    this.navCtrl.pop(); //setRoot(HomePage, {});
  }
}