import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

// Pages
import { HomePage, ModalContentPage } from '../home/home';

//Providers
import { ServerProvider } from '../../providers/server/server';
import { DbProvider } from '../../providers/db/db';



@IonicPage()
@Component({
  selector: 'page-boardsincupon',
  templateUrl: 'boardsincupon.html',
})
export class BoardsincuponPage {

  cupon: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toast: ToastController,  private db: DbProvider, private server: ServerProvider, public params: NavParams, public navParams: NavParams) {
    this.cupon = params.get('cupon');
    console.log("Cupon Abordar sin Cupon" + JSON.stringify(this.cupon));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardsincuponPage');
  }

  on_click_board_sin_cupon(){
    console.log("Cupon Abordar sin Cupon" + JSON.stringify(this.cupon));
    if (this.cupon.sinCuponAutoriza == "" || this.cupon.Observaciones == ""){
      return;
    }
    const confirm = this.alertCtrl.create({
      title: '¿Esta seguro de Abordar sin Cupón?',
      message: "¿Está completamente seguro de que el cupón que va a Abordar Sin Cupon es (" + this.cupon.numCupon + ")?",
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
            this.board_sin_cupon();
          }
        }
      ]
    });
    confirm.present();

  }

  board_sin_cupon(){
    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
      { "key": "idDetalleOpVehi", "value": this.cupon.idDetalleOpVehi },
    );

    var update = Array(
      { "key": "status", "value": 12 },
      { "key": "numAdultos", "value": this.cupon.numAdultos },
      { "key": "numNinos", "value": this.cupon.numNinos },
      { "key": "numInfantes", "value": this.cupon.numInfantes },
      { "key": "sincuponAutoriza", "value": "'" +this.cupon.sinCuponAutoriza + "'" },
      { "key": "Observaciones", "value": "'" +this.cupon.Observaciones + "'" },
      { "key": "is_sinc_board_sin_cupon", "value": 0 },
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
