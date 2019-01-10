import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { AnswerPage} from '../answer/answer';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  poll_id = 0;

  list_quiz ={
    poll_id: 0,
    online_poll_id: 0,
    language_id: 0,
    name: "",
    questions: {}
  };

  poll = {
    idReservaDetalle: 0,
    name_full: "",
    email: "",
    phone: "",
    language_id: 0,
    color: "#000000",
    reply: Array
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private db: DbProvider) {
    var cupon = navParams.get('cupon');

    console.log("Llego a Language" + JSON.stringify(cupon));

    this.poll.idReservaDetalle = cupon.idReservaDetalle;
    this.poll.name_full = cupon.Huesped;
    this.poll.email = cupon.email;
    this.poll.phone = cupon.phone;
  }

  on_click_language(language_id){

    this.storage.get('poll_id').then((val) => {
      this.poll_id = val;
    }).then(() => {
      this.list_quiz.questions = [];
      this.db.poll_select_by_id(this.poll_id, language_id).then((poll) => {
        this.list_quiz.poll_id = poll.poll_id;
        this.list_quiz.online_poll_id = poll.online_poll_id;
        this.list_quiz.language_id = poll.language_id;
        this.list_quiz.name = poll.name;

        this.poll.color = poll.color;

        // Busco las Preguntas de la Encuesta
        this.db.poll_select_all(poll.poll_id, language_id).then((data) => {
          for (let index = 0; index < data.length; index++) {      
            this.db.answer_select(data[index].question_id).then((answer) => {
              data[index]['answers'] =  answer;
            });
          }
          this.list_quiz.questions = data;
        });
      });
    });

    
  }

  on_click_start() {
    var info = {
      poll: this.poll,
      list_quiz: this.list_quiz
    }
    this.navCtrl.push(AnswerPage, info).catch(e => console.log("Error" + e));
  }

}
