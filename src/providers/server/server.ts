import { Injectable } from '@angular/core';

import {xml2js, parseString} from 'xml2js';

import { Http, Headers, Response, RequestOptions} from '@angular/http';

import {ToastController } from 'ionic-angular';


import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class ServerProvider {

  private url_prisma: String = "http://prismasoft.mx/demos/gonatural/api"; // mobil
  private url_gonatural: String = "http://ws.gonaturalexplorers.com/ws.asmx";  // mobil
  
  
  //private url_prisma: String = "http://localhost:8100/api"; // web
  //private url_gonatural: String = "http://localhost:8080/ws.asmx"; // web
  
  constructor(public http: Http, private http_: HttpClient, public toast: ToastController ) { }

  headers = new Headers({'Content-Type' : 'application/x-www-form-urlencoded' });
  private options = new RequestOptions({ headers: this.headers });

  // Encuesta
  get_quizs(): Observable<Response>{
    return this.http.get(this.url_prisma + "/poll")
    .timeout(1500)
    .map(res => {
      return res.json();
    })
    .catch(this.handleError);
  }

  post_answers(data: any){
    let postData = new FormData();
    postData.append('language_id', data.language_id);
    postData.append('poll_id', data.poll_id);
    postData.append('phone',  data.phone);
    postData.append('question_type', data.question_type);
    postData.append('reply_id', data.reply_id);
    postData.append('answer_id', data.answer_id);
    postData.append('poll_name', data.poll_name);
    postData.append('question_name' , data.question_name);
    postData.append('name_full', data.Huesped);
    postData.append('answer_name', data.answer_name);
    postData.append('question_id', data.question_id);
    postData.append('idCupon', data.idCupon);
    postData.append('idReservaDetalle', data.idReservaDetalle);
    postData.append('is_sinc', data.is_sinc);
    postData.append('email', data.email);
    postData.append('signature_1', data.signature_1);
    postData.append('signature_2', data.signature_2);

    return this.http.post(this.url_prisma + "/answers", postData)
    .map(res => {
      return res.json();
    }).catch(this.handleError);
  }

  // Ws Gonatural

  Abordar(index:number, idOpVehi: number, idReservaDetalle : number, numAdulto: number, numNino: number, numInfante: number){
    var status = 14;
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/Abordar\
    ?idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &status=" + status + "\
    &numAdulto=" + numAdulto + "\
    &numNino=" + numNino + "\
    &numInfante=" + numInfante;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {    

      let response = {
        "status": "false",
        "index": index
      }

      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  AbordarSinCupon(index:number, idOpVehi: number, idReservaDetalle : number, idDetalleOpVehi: number, numAdulto: number, numNino: number, numInfante: number, sinCuponAutoriza: String, obs:String ){
    var status = 12;
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/AbordarSinCupon\
    ?idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &idDetalleOpVehi=" + idDetalleOpVehi + "\
    &status=" + status + "\
    &numAdulto=" + numAdulto + "\
    &numNino=" + numNino + "\
    &numInfante=" + numInfante + "\
    &sinCuponAutoriza=" + sinCuponAutoriza + "\
    &obs=" + obs;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response = {
        "status": "false",
        "index": index
      }
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  CambiarCupon(index:number, nuevoNumCupon: number, numCupon: number, idOpVehi: number, idReservaDetalle : number, idDetalleOpVehi: number){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/CambiarCupon\
    ?idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &idDetalleOpVehi=" + idDetalleOpVehi + "\
    &nuevoNumCupon=" + nuevoNumCupon + "\
    &numCupon=" + numCupon;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response = {
        "status": "false",
        "index": index
      }
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  CambiarPAX(index:number, idOpVehi: number, idReservaDetalle : number, idDetalleOpVehi: number, numAdulto: number, numNino: number, numInfante: number){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/CambiarPAX\
    ?idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &idDetalleOpVehi=" + idDetalleOpVehi + "\
    &numAdulto=" + numAdulto + "\
    &numNino=" + numNino + "\
    &numInfante=" + numInfante;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response = {
        "status": "false",
        "index": index
      }
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  DownApoyo(idOpVehi: number){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/DownApoyo\
    ?idOpVehi=" + idOpVehi;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response;
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response = result;
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  MarcarNoShow(index:number, idOpVehi: number, idReservaDetalle : number, idDetalleOpVehi: number, NoFolio: String, AQuienSeEntrega: String, Motivo: String){
    var status = 11;
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/MarcarNoShow\
    ?&status=" + status + "\
    &idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &idDetalleOpVehi=" + idDetalleOpVehi + "\
    &NoFolio=" + NoFolio + "\
    &AQuienSeEntrega=" + AQuienSeEntrega + "\
    &Motivo=" + Motivo;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response = {
        "status": "false",
        "index": index
      }
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  ObtenerOrdenServicio(idOpVehi: number, apoyo: boolean){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/ObtenerOrdenServicio?idOpVehi=" + idOpVehi + "&apoyo=" + apoyo;

    return this.http.get(url, options)
    .map(res => {  
      let response;
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          console.log(error);
          throw new Error(error);
        } else {
          response = result['ArrayOfOrdenServicio']['OrdenServicio'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  Updatepickups(index:number, idOpVehi: number, idReservaDetalle : number, hentrada : String, hsalida : String){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/Updatepickups\
    ?idOpVehi=" + idOpVehi + "\
    &idReservaDetalle=" + idReservaDetalle + "\
    &hentrada=" + hentrada + "\
    &hsalida=" + hsalida;

    return this.http.get(url, options)
    .timeout(1500)
    .map(res => {      
      let response = {
        "status": "false",
        "index": index
      }
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          throw new Error(error);
        } else {
          response['status'] = result['boolean']['_'];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  post_photo(data : any){

    console.log("Photo Post: " + data.idReservaDetalle);

    let postData = new FormData();
    postData.append('idReservaDetalle', data.idReservaDetalle);
    postData.append('signature_1', data.signature_1);
    postData.append('signature_2', data.signature_2);
    postData.append('phone',  data.phone);
    postData.append('name_full', data.Huesped);
    postData.append('email', data.email);

    return this.http.post(this.url_prisma + "/photo", postData)
    .map(res => {
      return res.json();
    }).catch(this.handleError);
  }

  ObtenerCupones(idOpVehi: number, apoyo: boolean){
    var headers = new Headers({'Accept' : 'application/xml' });
    var options = new RequestOptions({ headers: headers });

    var url = this.url_gonatural + "/ObtenerCupones?idOpVehi=" + idOpVehi + "&apoyo=" + apoyo;
    console.log(url);

    return this.http.get(url, options)
    .map(res => {      
      let response;
      parseString( res.text(), { explicitArray: false }, function (error, result) {
        if (error) {
          console.log(error);
          throw new Error(error);
        } else {
          response = result["ArrayOfCuponesHoja"]["CuponesHoja"];
        }
      });
     return response;
    })
    .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);

    let toast = this.toast.create({
      message: errMsg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);

    return Observable.throw(errMsg);
  }   

  // --
  generate_update_sql(update:Array<{}>, where: Array<{}>, table = "cupon"){
    if(update.length == 0 || where.length == 0){
      return;
    }

    var sql = "UPDATE " + table + " SET";

    for (let i = 0; i < update.length; i++) {
      const item_update = update[i];
      sql += " " + item_update['key'] + " = " + item_update['value'];

      if (update.length > i + 1){
        sql += ",";
      }
    }

    sql += " WHERE";
    for (let i = 0; i < where.length; i++) {
      const item_where = where[i];
      sql += " " + item_where['key'] + " = " + item_where['value'];

      if (where.length > i + 1){
        sql += ",";
      }
    }
    console.log(sql);

  }
}

//{ 'Content-Type': 'application/json' }
// https://forum.ionicframework.com/t/http-post-array-in-ionic-3-sqlite-angular-4/123754