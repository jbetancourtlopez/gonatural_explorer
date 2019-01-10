import { Component } from '@angular/core';
import { IonicPage, Platform, ToastController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SoapService } from './soap.service'



// Obervables
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription';


// Providers
import { DbProvider } from '../../providers/db/db';
import { ServerProvider } from '../../providers/server/server';
import { timeout } from 'rxjs/operator/timeout';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-sync',
  providers: [SoapService],
  templateUrl: 'sync.html',
})
export class SyncPage {

  list: any;
  count_reply = 0;
  count_cupon = 0;
  idOpVehi:number = 0;
  public observable_count_reply = new Subject<number>();
  public observable_count_cupon = new Subject<number>();
  connected: Subscription;
  disconnected: Subscription;

  constructor(private platform: Platform, public navCtrl: NavController, public toast: ToastController,  public navParams: NavParams, private db: DbProvider, private server: ServerProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public soapService: SoapService) {
    
    this.observable_count_reply.subscribe(val => {
      this.count_reply = val;
    })

    this.observable_count_cupon.subscribe(val => {
      this.count_cupon = val;
    })


  }

  ionViewDidLoad() { 
    this.load_count_reply();
    this.load_count_cupons();
  }

  // Generales
  load_count_reply(){
    this.db.reply_select().then((list_data: any[]) =>{
      this.observable_count_reply.next(list_data.length);
    }).catch(error => { console.log(JSON.stringify(error)); });
  }

  // Cupones
  get_cupones(){
    this.db.cupones_select().then((response: any[]) =>{
  
        if (response.length > 0){
          let toast = this.toast.create({
            message: 'Debe limpiar la Base de Datos Local. Antes de obtener un nuevo servicio',
            duration: 2000,
            position: 'bottom'
          });
          toast.present(toast);
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

          }, 2000);
        }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  }

  send_cupones(){

    if(this.count_cupon == 0){
      let toast = this.toast.create({
        message: 'Usted no tiene cupones por sincronizar.',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return true;
    }

    var loader = this.loadingCtrl.create({
      content: 'Sincronizando... Enviado datos.'  });
    loader.present();

    this.db.cupones_select().then((response_cupon: any[]) =>{

      //Abordar
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(cupon.is_sinc_board == 0){
          this.server.Abordar(i, cupon.idOpVehi, cupon.idReservaDetalle, cupon.numAdultos, cupon.numNinos, cupon.numInfantes).subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_board');
              console.log("Abordo Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      //No show
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_no_show == 0){
          this.server.MarcarNoShow(i, cupon.idOpVehi, cupon.idReservaDetalle, cupon.idDetalleOpVehi, cupon.NoFolio, cupon.AQuienSeEntrega, cupon.Motivo) 
          .subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_no_show');
              console.log("No show Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      //Change cupon
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_change_cupon == 0){
          //console.log("Rep: " + cupon.nombreRepresentante);
          this.server.CambiarCupon(i, cupon.nuevoNumCupon, cupon.numCupon, cupon.idOpVehi, cupon.idReservaDetalle, cupon.idDetalleOpVehi) 
          .subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_change_cupon');
              console.log("Change Cupon Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      //Change Pasajero
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_change_person == 0){
          this.server.CambiarPAX(i, cupon.idOpVehi, cupon.idReservaDetalle, cupon.idDetalleOpVehi, cupon.numAdultos, cupon.numNinos, cupon.numInfantes) 
          .subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_change_person');
              console.log("Change Pax Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      //Abordar Sin Cupon
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_board_sin_cupon == 0){
          this.server.AbordarSinCupon(i, cupon.idOpVehi, cupon.idReservaDetalle, cupon.idDetalleOpVehi, cupon.numAdultos, cupon.numNinos, cupon.numInfantes, cupon.sincuponAutoriza, cupon.Observaciones) 
          .subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_board_sin_cupon');
              console.log("Abordar Sin Cupon Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      //Update Pickups
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_pickups == 0){
          this.server.Updatepickups(i, cupon.idOpVehi, cupon.idReservaDetalle, cupon.pickUpIn, cupon.pickUpOut) 
          .subscribe(response => {
            if (response.status == "true"){
              this.update_cupon(response_cupon[response.index], 'is_sinc_pickups');
              console.log("Update Pickups Completo Sinc");
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }

      // Update Signature
      //is_sinc_signature
      for(let i=0; i< response_cupon.length; i++){
        var cupon = response_cupon[i];
        if(response_cupon[i].is_sinc_signature == 0){
          this.server.post_photo(response_cupon[i]) 
          .subscribe(response => {
            console.log("Update is_sinc_signature Completo Sinc" + JSON.stringify(response.status));
            if (response.status == "OK"){
              //this.update_cupon(response_cupon[response.index], 'is_sinc_signature');
              console.log("1 Update is_sinc_signature Completo Sinc" + JSON.stringify(response));
            }
          }, error =>{
            console.log(console.log(JSON.stringify(error)));
          });
        }
      }
      
    
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
    
      setTimeout(() => { // Only for demonstration purpose
        this.load_count_cupons();
        loader.dismiss();
      }, 1100);
    
  }

  update_cupon(cupon:any, field: string){

    var where_ = Array(
      { "key": "idOpVehi", "value": cupon.idOpVehi },
      { "key": "idReservaDetalle", "value": cupon.idReservaDetalle },
      { "key": "idDetalleOpVehi", "value": cupon.idDetalleOpVehi },
    );

    var update = Array(
      { "key": field, "value": 1 }              
    );

    this.db.cupones_update(update, where_).then((response) =>{
      console.log("Update: " + JSON.stringify(response));
    });
  }

  delete_cupon(){
    const confirm = this.alertCtrl.create({
      title: '¿Eliminar Base de Datos Local?',
      message: 'Una vez eliminada la base de datos esta no se podra recuperar.',
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
            this.db.sql_raw("DELETE FROM cupon").then((response) => {
              console.log(response);
            }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });

            this.db.sql_raw("DELETE FROM orden").then((response) => {
              console.log(response);
            }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
          }
        }
      ]
    });
    confirm.present();
  }

  load_count_cupons(){
    var sql = "SELECT * FROM cupon WHERE\
    is_sinc_board = 0 OR\
    is_sinc_board_sin_cupon = 0 OR\
    is_sinc_change_cupon = 0 OR\
    is_sinc_change_person = 0 OR\
    is_sinc_no_show = 0 OR\
    is_sinc_signature = 0 OR\
    is_sinc_pickups = 0";
    this.db.sql_raw(sql).then((response: any[]) => {
      //console.log(response);
      this.observable_count_cupon.next(response.length);
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  }

  on_click_delete(){
    var sql = "SELECT * FROM cupon WHERE\
    is_sinc_board = 0 OR\
    is_sinc_board_sin_cupon = 0 OR\
    is_sinc_change_cupon = 0 OR\
    is_sinc_change_person = 0 OR\
    is_sinc_no_show = 0 OR\
    is_sinc_pickups = 0";
    this.db.sql_raw(sql).then((response: any[]) => {
      console.log(response);
      if (response.length > 0){
        let toast = this.toast.create({
          message: 'Usted tiene datos que no ha sincronizado. <br> Favor de Sincronizar antes de Borrar.',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }else{
        
        this.delete_cupon();
        let toast = this.toast.create({
          message: 'La Base de Datos ha sido Borrada.',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  
  }

  // Encuesta
  sync_quiz(){
    var loader = this.loadingCtrl.create({
      content: 'Sincronizando... Espere.'  });
    loader.present();
       
    this.db.delete_all_poll()
    .then((data) => {
      console.log("DELETE");
    });

    this.server.get_quizs().subscribe(data => {
      this.list = data;
      this.db.insert_sync_poll(this.list);
    })
    loader.dismiss();
  }

  sync_answer(){
    var loader = this.loadingCtrl.create({content: 'Sincronizando... Espere.'  });
    loader.present();

    var list_: any = [];

    this.db.reply_select().then(list_data =>{
      list_ = list_data;
      for(let i=0; i< list_.length; i++){
        var form_data = list_[i];

        console.log("form_data: " + JSON.stringify(form_data));

        this.server.post_answers(form_data).subscribe(response => {
          console.log("response: " + JSON.stringify(response));
          var reply_id = response.data.reply_id;
          if (response.status == "OK"){
            this.db.reply_update(reply_id).catch(error => { console.log(JSON.stringify(error)); });
          }
        }, error =>{
          console.log(console.log("ERROR: " + JSON.stringify(error)));
        });
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });

    this.load_count_reply();
    loader.dismiss();
  }
  // --


  select_debug(){
    var poll_local = {};
    var poll_id = 89;
    var language_id = 1;

    this.db.poll_select_all(poll_id, language_id).then(data =>{
      for (let index = 0; index < data.length; index++) {        
          this.db.answer_select(data[index].question_id).then((answer) => {
            console.log("Item Answer: " + JSON.stringify(answer));
            data[index]['answer'] =  answer;
            poll_local = data;
          });
      }
      console.log("local: " + JSON.stringify(poll_local));
    }).catch(e => { console.log(e); });
  }

}

/*
http://www.holidaywebservice.com//HolidayService_v2/HolidayService2.asmx
https://blog.ionicframework.com/handling-cors-issues-in-ionic/

https://github.com/infoxicator/angular2-soap
https://jsonplaceholder.typicode.com/
http://blog.getpostman.com/2014/08/22/making-soap-requests-using-postman/?_ga=2.116699138.583797586.1538021329-1267253474.1538021329
*/