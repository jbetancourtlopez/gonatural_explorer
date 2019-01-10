import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, Nav } from 'ionic-angular';

import {AnswerPage} from '../answer/answer';
import {LanguagePage} from '../language/language';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

// Providers
import { DbProvider } from '../../providers/db/db';
import { GlobalProvider } from "../../providers/global/global";


@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {
  @ViewChild(Nav) nav: Nav;

  list_customer: any[] = [];
  public observable_list_customer = new Subject<any>();

  constructor(public navCtrl: NavController, private db: DbProvider,  public loadingCtrl: LoadingController, public navParams: NavParams, public global: GlobalProvider) {
    this.observable_list_customer.subscribe((response:any[]) => {
      this.list_customer = response;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuizPage');
    this.load_data();
  }

  load_data(){
    var loader = this.loadingCtrl.create({
      content: 'Recuperando datos... Espere.'  });
    loader.present();
      
    var select = Array(
      { "value": 'idReservaDetalle' },
      { "value": 'email' },
      { "value": 'phone' },
      { "value": 'ididioma' },
      { "value": 'numCupon' },
      { "value": 'Huesped' }
    );

    this.db.cupones_select_quiz().then((response:any[]) =>{    
      setTimeout(() => { // Only for demonstration purpose
        this.observable_list_customer.next(response);
        loader.dismiss();
      }, 1000);
      
    }).catch(e => { console.log(JSON.stringify(e)); });
  }
  
  answer_item(item){
    console.log('click' + JSON.stringify(item));
    this.navCtrl.push(LanguagePage, {cupon: item});
  }

}
