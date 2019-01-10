import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SheetPage } from '../sheet/sheet';


// Provider
import { DbProvider } from '../../providers/db/db';

@IonicPage()
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { 
    'minWidth': 1,
    'canvasWidth': 340,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#000'
  };
  public signatureImage : string;
  public option = 0;
  cupon: any;

  constructor(public navCtrl: NavController, public toast: ToastController, public params: NavParams, private db: DbProvider) {
    this.option = params.get('option');
    this.cupon = params.get('cupon');
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    console.log("Image 1" + this.signatureImage);
    var data = {
      signatureImage_1: '',
      signatureImage_2: '',
      cupon: this.cupon
    }

    console.log("Image 1.1");
    if (this.option == 1){
      console.log("Image 1.True");
      data.signatureImage_1 = this.signatureImage;
    }else{
      console.log("Image 1.False");
      data.signatureImage_2 = this.signatureImage;
    }
    
    var where_ = Array(
      { "key": "idOpVehi", "value": this.cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": this.cupon.idReservaDetalle },
      { "key": "idDetalleOpVehi", "value": this.cupon.idDetalleOpVehi },
    );

    var update = Array(
      { "key": 'signature_' + this.option, "value": "'" + this.signatureImage + "'" },
      { "key": 'is_sinc_signature', "value": "0" }
      
      );

    console.log("Image 3");

    this.db.cupones_update(update, where_).then(() =>{
      let toast = this.toast.create({
        message: 'Firma guardada con exito ',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }).catch(error => JSON.stringify(error));;

    this.navCtrl.push(SheetPage, data);
  }

  drawClear() {
    // this.db.customer_select().then(response => {
    //   console.log(JSON.stringify(response));
    // }).catch(error => console.log(error));
    this.signaturePad.clear();
  }

  drawCancel() {
    this.navCtrl.pop(); //(SheetPage);
  }

}
