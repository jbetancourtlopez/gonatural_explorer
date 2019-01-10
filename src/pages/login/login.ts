import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Base } from '../../base/base';

// Page
import {HomePage} from '../../pages/home/home';

// Obervables
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription';

// Providers
import { DbProvider } from '../../providers/db/db';
import {ServerProvider} from '../../providers/server/server';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends Base {

  idOpVehi:number;

  have_internet = true;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public alertCtrl: AlertController,
      public http: ServerProvider,
      public db: DbProvider,
      public server: ServerProvider,
      public loadingCtrl: LoadingController,
      public toast: ToastController,
      private network: Network    
    ) {
      super(toast, alertCtrl)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.validate_data();
    this.listenConnection();
  }

  private listenConnection(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        console.log("Desconectado");
        this.have_internet = false;
      });

      this.network.onConnect().subscribe(() => {
        alert('Conectado a Internet');
        this.have_internet = true;
        console.log('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi' || this.network.type === 'ethernet' || this.network.type === '3g' || this.network.type === '4g') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
  }

  validate_data(){
    this.db.cupones_select().then((response: any[]) =>{
      if (response.length > 0){
        this.db.orden_select().then((response_orden: any) =>{
          if (!response_orden){
            this.navCtrl.setRoot(HomePage);
          }
        }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  }

  login(){
    this.db.cupones_select().then((response: any[]) =>{
  
      if (response.length > 0){
        let toast = this.toast.create({
          message: 'Debe limpiar la Base de Datos Local. Antes de obtener un nuevo servicio',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);

        setTimeout(() =>{
          this.navCtrl.setRoot(HomePage);
        }, 3000);
        return;
      }else{
        // Validacion Numero
        if (this.idOpVehi == 0){
          let toast = this.toast.create({
            message: 'Ingrese un numero de folio valido',
            duration: 2000,
            position: 'bottom'
          });
          toast.present(toast);
          return;
        }

        var loader = this.loadingCtrl.create({
          content: 'Sincronizando... Obteniendo servicio.'  });
        loader.present();

        // Sincronizar cupones
        this.server.ObtenerCupones(this.idOpVehi, false).subscribe(data => {
          console.log("ObtenerCupones :" + JSON.stringify(data));
          for(let i=0; i< data.length; i++){
            var item = data[i];
            this.db.cupones_insert(item).then((data) => {
              console.log("Insertar Cupon:" + data);
            }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
          }
        }, error =>{
          console.log(console.log(JSON.stringify(error)));
        });

        // Sincronizar Ordenes
        var sql = "DELETE FROM orden";
        this.db.sql_raw(sql).then((response: any[]) => {
          this.server.ObtenerOrdenServicio(this.idOpVehi, false).subscribe(data_orden =>{
            console.log("ObtenerOrdenServicio: " + JSON.stringify(data_orden));
            this.db.orden_insert(this.idOpVehi, data_orden).then((data) =>{
              console.log("Orden Insertada:" + data);
            }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
          })
        })
        

       setTimeout(() =>{
          loader.dismissAll();
          
          let toast = this.toast.create({
            message: 'Sincronizacion completa de cupones',
            duration: 2000,
            position: 'bottom'
          });
          toast.present(toast);
          this.navCtrl.setRoot(HomePage);
        }, 3000);
      }
  }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });

  }

}
