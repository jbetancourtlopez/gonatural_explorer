import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';

// Pages
import { HomePage, ModalContentPage } from '../home/home';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { DbProvider } from '../../providers/db/db';


@IonicPage()
@Component({
  selector: 'page-changecupon',
  templateUrl: 'changecupon.html',
})
export class ChangecuponPage {
  cupon: any

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,  private db: DbProvider, public toast: ToastController,  public params: NavParams, private server: ServerProvider, public loadingCtrl: LoadingController) {
    this.cupon = params.get('cupon');
    console.log("Cambiar Cupon" + JSON.stringify(this.cupon));
  }

  on_clik_change_cupon(){
    const confirm = this.alertCtrl.create({
      title: '¿Esta seguro de Cambiar?',
      message: "¿Está completamente seguro de que el cupón que va a Cambiar es (" + this.cupon.numCupon + ")?",
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
            this.change_cupon();
          }
        }
      ]
    });
    confirm.present();
      
  }

  change_cupon(){
    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
    );

    var update = Array(
      { "key": "nuevoNumCupon", "value": "'" + this.cupon.nuevoNumCupon + "'"},
      { "key": "numCupon", "value": "'" + this.cupon.numCupon + "'"},
      { "key": "is_sinc_change_cupon", "value": "'" + 0  + "'"}
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
