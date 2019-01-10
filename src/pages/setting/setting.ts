import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Provider
import { DbProvider } from '../../providers/db/db';


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private db: DbProvider) { }

  select_poll_id = 0;
  poll_name = "";
  list_poll: any;

  ionViewDidLoad() {
    this.storage.get('poll_id').then((val) => {
      this.select_poll_id = val;
    });
    this.storage.get('poll_name').then((val) => {
      this.poll_name = val;
    });
    this.load_list_poll();
  }

  load_list_poll(){
    this.db.poll_select().then((list) => {      
      this.list_poll = list;
    });
  }


  on_click_poll(online_poll_id, name){
    this.storage.set('poll_id', online_poll_id);
    this.storage.set('poll_name', online_poll_id);
  }

}
