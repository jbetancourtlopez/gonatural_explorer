import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ToastController, Platform, NavParams, ViewController } from 'ionic-angular';

// Pages
import { HomePage, ModalContentPage } from '../home/home';

// Bar code
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// Providers
import { ServerProvider } from '../../providers/server/server';
import { GlobalProvider } from "../../providers/global/global";
import { DbProvider } from '../../providers/db/db';



//@IonicPage()
@Component({
  selector: 'page-board',
  templateUrl: 'board.html',
})
export class BoardPage {

  cupon_code = "";
  cupon: any;
  is_valid_cupon = false;

  constructor(public navCtrl: NavController, private db: DbProvider, public toast: ToastController, public viewCtrl: ViewController, public params: NavParams, private barcodeScanner: BarcodeScanner, public modalCtrl: ModalController, public alertCtrl: AlertController, private server: ServerProvider, public global: GlobalProvider) {
    this.cupon = params.get('cupon');
    console.log("Cupon Abordar" + JSON.stringify(this.cupon));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoardPage');
  }

  on_click_scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
     
      this.cupon_code = barcodeData.text;
    }).catch(err => {
         console.log('Error', err);
    });
  }

  on_click_find(){

    if(this.cupon_code == ""){
      return;
    }
      
    var end = this.cupon_code.length;
    if (end > 4){
      var init = end - 4;
    }
    var cupon_code_aux =  this.cupon_code.substring(init, end);

    end = this.cupon.numCupon.length;
    if (end > 4){
      init = end - 4;
    }
    var numCupon_aux =  this.cupon.numCupon.substring(init, end);

    if (cupon_code_aux == numCupon_aux){
      this.is_valid_cupon = true;

      let toast = this.toast.create({
        message: 'El cupón es valido para abordar',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);

    }else{
      let toast = this.toast.create({
        message: 'El cupón introducido es incorrecto',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      this.is_valid_cupon = false;
    }
  }

  on_click_board(){

    if(this.cupon.numAdultos == 0 && this.cupon.numNinos == 0 && this.cupon.numInfantes == 0){

      let toast = this.toast.create({
        message: 'Es imposible abordar a 0 personas. Si el cliente no se presentó, vaya al menú de opciones de la orden de servicio y seleccione No Show.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);
      return;
    }

    const confirm = this.alertCtrl.create({
      title: '¿Esta seguro de Abordar?',
      message: "¿Está completamente seguro de que el cupón que va a Abordar es (" + this.cupon.numCupon + ")?",
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
            this.board();
          }
        }
      ]
    });
    confirm.present();

    //let modal = this.modalCtrl.create(ModalTermsPage, {});
    //modal.present();
  }

  board(){
    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
    );

    var update = Array(
      { "key": "status", "value": 14 },
      { "key": "is_sinc_board", "value": 0 },
      { "key": "is_sinc_change_person", "value": 0 }
    );

    // { "key": "numAdultos", "value": this.cupon.numAdultos },
    // { "key": "numNinos", "value": this.cupon.numNinos },
    // { "key": "numInfantes", "value": this.cupon.numInfantes },

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

  onSearchChange(searchValue : string ) {  
    console.log(searchValue);
    this.is_valid_cupon = false;
  }
}

// Inicia el Modal
@Component({
  templateUrl: 'modal-terms.html'
})
export class ModalTermsPage {
  constructor(public navCtrl: NavController, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
