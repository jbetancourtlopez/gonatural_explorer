import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, NavParams } from 'ionic-angular';

// Pages
import { HomePage, ModalContentPage } from '../home/home';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { DbProvider } from '../../providers/db/db';



@IonicPage()
@Component({
  selector: 'page-changeperson',
  templateUrl: 'changeperson.html',
})
export class ChangepersonPage {

  cupon:any;

  constructor(public navCtrl: NavController,  public alertCtrl: AlertController, public toast: ToastController,  private db: DbProvider, public params: NavParams, private server: ServerProvider,) {
    this.cupon = params.get('cupon');
    console.log("Cambiar PAX" + JSON.stringify(this.cupon));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepersonPage');
  }

  on_click_change_pax(){

    const confirm = this.alertCtrl.create({
      title: '¿Esta seguro de Cambiar?',
      message: "¿Es la cantidad correcta de pasajeros del cupon (" + this.cupon.numCupon + ")?",
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
            console.log('Agree clicked');
            this.change_pax();
          }
        }
      ]
    });
    confirm.present();

  }

  change_pax(){
    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
      { "key": "idDetalleOpVehi", "value": this.cupon.idDetalleOpVehi },
    );

    var update = Array(
      { "key": "numAdultos", "value": this.cupon.numAdultos },
      { "key": "numNinos", "value": this.cupon.numNinos },
      { "key": "numInfantes", "value": this.cupon.numInfantes },
      { "key": "is_sinc_change_person", "value": 0 }
      
    );

    this.db.cupones_update(update, where_).then(() =>{
        let toast = this.toast.create({
          message: 'Operación completada con exito ',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
        this.navCtrl.setRoot(HomePage);
    });
  }

}
