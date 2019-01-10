import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {


  //Internalizacion
  language = {
    required: [
      "Requerido",
      "Required",
      "Req Frances",
      "Req Alem"
    ] 
  }

  get_language(value, language){
    return this.language[value][language];
  }

  // Bandera
  flat = {
    2: "es.png",
    100: "mx.png",
    3: "us.png",
    4: "fr.png",
  }

  get_flat(flat_key){
    

    if (typeof this.flat[flat_key] == undefined || flat_key == null){
      return "mx.png";

    } else{
      return this.flat[flat_key];;
    }
  }

  // Estados
  status = {
    1: {
      color: "orange",
      name: "PENDIENTE"
    },
    14: {
      color: "green",
      name: "ABORDO"
    },
    12: {
      color: "yellow",
      name: "ABORDO SIN CUPÓN"
    },
    11: {
      color: "red",
      name: "NO SHOW"
    }
  }

  get_status(status_key){
    
    if (typeof this.status[status_key] == undefined || status_key == null){
      return {
        color: "orange",
        name: "No Definido"
      };

    } else{
      return this.status[status_key];
    }
  }


  get_hour_current(){
    let hour = this.addZero(new Date().getHours());
    let minutes = this.addZero(new Date().getUTCMinutes()); // getTime(); // getMinutes();

    return hour + ":" + minutes;
  }

  addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  }
}
