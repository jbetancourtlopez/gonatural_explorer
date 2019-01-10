import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import {ThankPage} from '../thank/thank';
import { DbProvider } from '../../providers/db/db';
import { GlobalProvider } from "../../providers/global/global";

@IonicPage()
@Component({
  selector: 'page-answer',
  templateUrl: 'answer.html',
})
export class AnswerPage {
  @ViewChild(Slides) slides: Slides;

  poll: any;
  list_quiz: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController,
    private db: DbProvider,
    public global: GlobalProvider ) {

    this.poll = navParams.get('poll');
    this.list_quiz = navParams.get('list_quiz');
    var reply = [];
    
    console.log("Llegando a Answer" + JSON.stringify(this.list_quiz.questions));

    for (let index = 0; index < this.list_quiz.questions.length; index++) {
      const element = this.list_quiz.questions[index];
      var reply_item ={
        question_id: element["question_id"],
        question_name:element["question"],
        question_type:element["type"],
        answer_name:""
      }
      reply[index] = reply_item;
    }

    this.poll.poll_id = this.list_quiz.poll_id;
    this.poll.language_id = this.list_quiz.language_id;
    this.poll.poll_name = this.list_quiz.name;
    this.poll.reply = reply;
  }



  ionViewDidLoad() {
    var req = this.global.get_language('required', this.poll.language_id);
    console.log("Lang: " + req);
  }

  on_click_thank(){
    // Guardo en la Base de Datos
    var where_ = Array(
      { "key": "idReservaDetalle", "value": this.poll.idReservaDetalle }
    );

    var update = Array(
      { "key": "phone", "value": "'" + this.poll.phone + "'" },
      { "key": "email", "value": "'" + this.poll.email + "'" },
    );

    this.db.cupones_update(update, where_).then(() =>{
      this.db.reply_insert_service(this.poll.reply, this.poll.idReservaDetalle, this.poll.poll_id, this.poll.language_id, this.poll.poll_name);
    }).catch(e => { console.log(e); });
    
    this.db.reply_select().then((response) => {
      console.log(JSON.stringify(response));
    }).catch(e => { console.log(e); });
    

    this.navCtrl.setRoot(ThankPage, {poll: this.poll});
  }

  on_click_next(){
    let currentIndex = this.slides.getActiveIndex();
    var is_invalid = this.validate_question(currentIndex);
    this.slides.lockSwipeToNext(is_invalid);

    if (is_invalid){
      let toast = this.toastCtrl.create({
        message: 'Obligatorio',
        duration: 2000,
      });
      toast.present();
    }else{
      this.slides.slideNext();
    }
  }

  on_click_back(){
    this.slides.slidePrev();
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    this.slides.lockSwipeToNext(true);    
  }

  validate_question(index){
    if (index >= 1){
      console.log("Validate" + JSON.stringify(this.poll.reply));
      var value = this.poll.reply[index - 1].answer_name;
      console.log("Value" + JSON.stringify(value));
      if (value == ""){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }

  validate_data_customer(){
    if (this.poll.name_full == "" ||  typeof this.poll.name_full == "undefined" || this.poll.phone == "" ||  typeof this.poll.phone == "undefined" || this.poll.email == "" || typeof this.poll.email == "undefined" ){
      this.slides.lockSwipeToNext(true);
    }else{
      this.slides.lockSwipeToNext(false);
    }
  }

  on_click_content(){
  }


}
