import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';


import { HomePage, ModalContentPage } from '../pages/home/home';
import { SyncPage} from '../pages/sync/sync';
import { QuizPage} from '../pages/quiz/quiz';
import { SettingPage} from '../pages/setting/setting';
import { LoginPage} from '../pages/login/login'
import { AnswerPage} from '../pages/answer/answer'
import { ThankPage } from '../pages/thank/thank';
import { BoardPage } from '../pages/board/board';
import { ChangecuponPage } from '../pages/changecupon/changecupon';
import { NoshowPage} from '../pages/noshow/noshow';
import { BoardsincuponPage} from '../pages/boardsincupon/boardsincupon';
import { DetailPage} from '../pages/detail/detail';
import { SignaturePage } from '../pages/signature/signature';
import { SheetPage } from '../pages/sheet/sheet';



// Obervables
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription} from 'rxjs/Subscription';

//Providers
import { DbProvider } from '../providers/db/db';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon: string, component: any}>;

  
  user: any = {
    tour: "",
    idopveh: "",
    chofer: "",
    guia: "",
  };

  public observable_user = new Subject<any>();

  constructor(public events: Events, public platform: Platform, public alertCtrl: AlertController, public toast: ToastController, private db: DbProvider, private network: Network, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Pasajeros',      icon: 'body', component: HomePage },
      { title: 'Orden Servicio', icon: 'bonfire', component: DetailPage },
      { title: 'Encuesta',       icon: 'star', component: QuizPage },
      { title: 'Sincronizar',    icon: 'cloud-done', component: SyncPage },
      { title: 'Ajustes',        icon: 'build', component: SettingPage },
    ];

    events.subscribe('user:get_data_user', () => {
      this.get_data_user();
    });
    

    this.observable_user.subscribe(val => {
      this.user = val;
    })
  }

  ionViewDidLoad() {
  }

  get_data_user(){
    this.db.orden_select().then((response: any) =>{

      if (!response){
        //this.nav.setRoot(LoginPage)

        let toast = this.toast.create({
          message: 'Ocurrio un Error al cargar los datos, usted debe de cerrar e iniciar de nuevo',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);

      }else{
        console.log("User:" + JSON.stringify(response));
        this.observable_user.next(response);
        this.user = response;
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });


    this.db.cupones_select().then((response: any[]) =>{
      if (response.length == 0){
        alert("Regresando al login ...");
        this.nav.setRoot(LoginPage)
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.listenConnection();
    });
  }

  private listenConnection(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        console.log("Desconectado");
        this.pages[3] = { title: 'Sin/Int Sincronizar',      icon: 'cloud-done', component: {} };
      });

      this.network.onConnect().subscribe(() => {
        alert('Conectado a Internet');
        this.pages[3] = { title: 'Sincronizar', icon: 'cloud-done', component: SyncPage };
        console.log('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi' || this.network.type === 'ethernet' || this.network.type === '3g' || this.network.type === '4g') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.get_data_user();
    this.nav.setRoot(page.component);
  }


  on_click_login() {

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
          message: 'Usted tiene datos que no ha sincronizado. Favor de Sincronizar antes de Borrar.',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }else{
        this.delete_cupon();
      }
    }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
  
  }


  delete_cupon(){
    const confirm = this.alertCtrl.create({
      title: '¿Eliminar Base de Datos Local para Cerrar?',
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
              this.nav.setRoot(LoginPage);
            }).catch(e => { console.log(JSON.stringify(e, ["message", "arguments", "type", "name"])); });
          }
        }
      ]
    });
    confirm.present();
  }

  on_click_test(){
    alert("hola");
  }
}
