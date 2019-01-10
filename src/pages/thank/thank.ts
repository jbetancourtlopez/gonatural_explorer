import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {QuizPage} from '../quiz/quiz';



@IonicPage()
@Component({
  selector: 'page-thank',
  templateUrl: 'thank.html',
})
export class ThankPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankPage');
  }

  on_click_back(){
    this.navCtrl.setRoot(QuizPage);
  }



}
