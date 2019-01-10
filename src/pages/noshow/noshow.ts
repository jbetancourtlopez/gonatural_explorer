import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController } from 'ionic-angular';

// Pages
import { HomePage, ModalContentPage } from '../home/home';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { DbProvider } from '../../providers/db/db';



@IonicPage()
@Component({
  selector: 'page-noshow',
  templateUrl: 'noshow.html',
})
export class NoshowPage {

  cupon: any;

  constructor(public navCtrl: NavController, public toast: ToastController,  private db: DbProvider, public params: NavParams, private server: ServerProvider, public alertCtrl: AlertController) {
    this.cupon = params.get('cupon');
    
    console.log("No Show" + JSON.stringify(this.cupon));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoshowPage');
  }

  on_click_no_show(){
    const confirm = this.alertCtrl.create({
      title: '¿Esta seguro de No Show?',
      message: "¿Está completamente seguro de que el cupón que va a No Show es (" + this.cupon.numCupon + ")?",
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
            this.no_show();
          }
        }
      ]
    });
    confirm.present();
   
  }

  no_show(){

    if(this.cupon.NoFolio == 0 || this.cupon.NoFolio == ''){

      let toast = this.toast.create({
        message: 'El número de folio no puede ser 0 o vacio.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);
      return;
    }

    if(this.cupon.Motivo == ''){

      let toast = this.toast.create({
        message: 'Debe de ingresar un motivo.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);
      return;
    }


    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
    );

  

    var update = Array(
      { "key": "status", "value": 11 },
      { "key": "NoFolio", "value": this.cupon.NoFolio },
      { "key": "AQuienSeEntrega", "value": "' " + this.cupon.AQuienSeEntrega + " '" },
      { "key": "Motivo", "value": "' " + this.cupon.Motivo + " '" },
      { "key": "is_sinc_no_show", "value": 0 }
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
