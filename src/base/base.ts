import {AlertController, ToastController,} from 'ionic-angular';


export class Base {

    constructor(public toast: ToastController,  public alertCtrl: AlertController) {
        
    }


    toast_msg(message:string){
        let toast = this.toast.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        toast.present(toast);
    }
}