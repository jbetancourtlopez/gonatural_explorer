import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class DbProvider {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<Boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'data_v22.db',
        location: 'default'
      })
      .then((db:SQLiteObject) => {
        this.database = db;

        this.createTables().then(()=>{
          this.dbReady.next(true);
        });
      })
    });
  }

  // Creacion de table
  private createTables(){
  
    //Encuesta
    let sql_poll = 'CREATE TABLE IF NOT EXISTS poll(\
              poll_id INTEGER PRIMARY KEY AUTOINCREMENT,\
              online_poll_id INTEGER,\
              language_id INTEGER,\
              name TEXT,\
              color TEXT);';

    this.database.executeSql(sql_poll, [])
    .then(res => console.log('Executed SQL POLL'))
    .catch(e => console.log(e));

    //Preguntas
    let sql_question = 'CREATE TABLE IF NOT EXISTS question(\
            question_id INTEGER PRIMARY KEY AUTOINCREMENT,\
            poll_id INTEGER,\
            language_id INTEGER,\
            type INTEGER,\
            question TEXT);';

    this.database.executeSql(sql_question, [])
    .then(res => console.log('Executed SQL QUESTION'))
    .catch(e => console.log(e));

    //Respuesta de las preguntas
    let sql_answer = 'CREATE TABLE IF NOT EXISTS answer(\
            answer_id INTEGER PRIMARY KEY AUTOINCREMENT,\
            question_id INTEGER,\
            answer TEXT,\
            type INTEGER);';

    this.database.executeSql(sql_answer, [])
    .then(res => console.log('Executed SQL ANSWERS'))
    .catch(e => console.log(e));

    //Resultado de Encuesta
    let sql_reply = 'CREATE TABLE IF NOT EXISTS reply(\
      reply_id INTEGER PRIMARY KEY AUTOINCREMENT,\
      idReservaDetalle INTEGER,\
      poll_id INTEGER,\
      language_id INTEGER,\
      poll_name TEXT,\
      question_id INTEGER,\
      question_name TEXT,\
      question_type INTEGER,\
      answer_id INTEGER,\
      answer_name TEXT,\
      is_sinc INTEGER\);';

    this.database.executeSql(sql_reply, [])
    .then(res => console.log('Executed SQL REPLY'))
    .catch(e => console.log(e));

    let sql_cupones = 'CREATE TABLE IF NOT EXISTS cupon(\
      idCupon INTEGER PRIMARY KEY AUTOINCREMENT,\
      is_sinc_board INTEGER DEFAULT 1,\
      is_sinc_board_sin_cupon INTEGER DEFAULT 1,\
      is_sinc_change_cupon INTEGER DEFAULT 1,\
      is_sinc_change_person INTEGER DEFAULT 1,\
      is_sinc_no_show INTEGER DEFAULT 1,\
      is_sinc_pickups INTEGER DEFAULT 1,\
      is_sinc_signature INTEGER DEFAULT 1,\
      idReservaDetalle INTEGER,\
      idOpVehi INTEGER,\
      idDetalleOpVehi INTEGER,\
      numCupon TEXT,\
      Huesped TEXT,\
      numAdultos INTEGER,\
      numNinos INTEGER,\
      numInfantes INTEGER,\
      numAdultos_bk INTEGER,\
      numNinos_bk INTEGER,\
      numInfantes_bk INTEGER,\
      Incentivos INTEGER,\
      Hotel TEXT,\
      Habitacion TEXT,\
      Idioma TEXT,\
      PickUpLobby TEXT,\
      nombreAgencia TEXT,\
      nombreRepresentante TEXT,\
      Observaciones TEXT,\
      Motivo TEXT,\
      status INTEGER,\
      tour_padre INTEGER,\
      ididioma INTEGER,\
      color TEXT,\
      idapoyo INTEGER,\
      pickUpIn DATETIME,\
      pickUpOut DATETIME,\
      tipoSolicitud INTEGER DEFAULT 0,\
      NoFolio TEXT DEFAULT " ",\
      AQuienSeEntrega TEXT DEFAULT " ",\
      sincuponAutoriza TEXT DEFAULT " ",\
      nuevoNumCupon TEXT DEFAULT "0",\
      email TEXT DEFAULT " ",\
      phone TEXT DEFAULT " ",\
      signature_1 TEXT,\
      signature_2 TEXT);';

      this.database.executeSql(sql_cupones, [])
      .then(res => console.log('Executed SQL CUPON'))
      .catch(e => console.log(e));

      let sql_vehiculos ="CREATE TABLE IF NOT EXISTS orden(\
        idOrden INTEGER PRIMARY KEY AUTOINCREMENT,\
        idopveh INTEGER,\
        Guia TEXT,\
        Vehiculo TEXT,\
        Transportadora TEXT,\
        idGuia TEXT,\
        chofer TEXT,\
        obs TEXT,\
        rfc TEXT,\
        razon TEXT,\
        dir TEXT,\
        tour TEXT,\
        licencia TEXT,\
        apoyo INTEGER);";

    return this.database.executeSql(sql_vehiculos, [])
    .then(res => console.log('Executed SQL ORDEN'))
    .catch(e => console.log(e));
  }

  private isReady(){
    return new Promise((resolve, reject)=> {
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      } 
    })
  }

  /*Orden */
  orden_insert(idopveh, data){
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO orden (\
        idopveh,\
        Guia,\
        Vehiculo,\
        Transportadora,\
        idGuia,\
        chofer,\
        obs,\
        rfc,\
        razon,\
        dir,\
        licencia,\
        tour,\
        apoyo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      var values = [
        idopveh,
        data.Guia,
        data.Vehiculo,
        data.Transportadora,
        data.idGuia,
        data.chofer,
        data.obs,
        data.rfc,
        data.razon,
        data.dir,
        data.licencia,
        data.tour,
        0
      ];

      return this.database.executeSql(sql, values)
      .then((result)=>{
        return result.insertId;
      })
    }).catch(e => console.log(JSON.stringify(e)) );
  }

  orden_select(){
    return this.isReady()
    .then(()=>{
      var sql = 'SELECT * FROM orden';
      console.log(sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{

        if(query.rows.length){
          return query.rows.item(0);
        }
        return false
      }).catch(e => console.log(e));
    })
  }

  /*CUPONES */
  cupones_insert(data){
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO cupon (\
      is_sinc_board,\
      is_sinc_board_sin_cupon,\
      is_sinc_change_cupon,\
      is_sinc_change_person,\
      is_sinc_no_show,\
      is_sinc_pickups,\
      is_sinc_signature,\
      idReservaDetalle,\
      idOpVehi,\
      idDetalleOpVehi,\
      numCupon,\
      Huesped,\
      numAdultos,\
      numNinos,\
      numInfantes,\
      numAdultos_bk,\
      numNinos_bk,\
      numInfantes_bk,\
      Incentivos,\
      Hotel,\
      Habitacion,\
      Idioma,\
      PickUpLobby,\
      nombreAgencia,\
      nombreRepresentante,\
      Observaciones,\
      Motivo,\
      status,\
      tour_padre,\
      ididioma,\
      color,\
      idapoyo,\
      pickUpIn,\
      pickUpOut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      var values = [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        data.idReservaDetalle,
        data.idOpVehi,
        data.idDetalleOpVehi,
        data.numCupon,
        data.Huesped,
        data.numAdultos,
        data.numNinos,
        data.numInfantes,
        data.numAdultos,
        data.numNinos,
        data.numInfantes,
        data.Incentivos,
        data.Hotel,
        data.Habitacion,
        data.Idioma,
        data.PickUpLobby,
        data.nombreAgencia,
        data.nombreRepresentante,
        data.Observaciones,
        'NA',
        data.estatus,
        data.tour_padre,
        data.idIdioma,
        data.color,
        data.idapoyo,
        data.pickUpIn,
        data.pickUpOut
      ];

      return this.database.executeSql(sql, values)
      .then((result)=>{
        return result.insertId;
      })
    }).catch(e => console.log(JSON.stringify(e)) );
  }

  cupones_select_quiz(){

    return this.isReady().then(()=>{
      var sql = 'SELECT c.idReservaDetalle, c.email, c.phone, c.ididioma, c.numCupon, c.Huesped FROM cupon c\
      LEFT JOIN reply r ON c.idReservaDetalle = r.idReservaDetalle\
      WHERE r.idReservaDetalle IS NULL AND (c.status = 14 OR c.status = 12)';


      console.log("SQL: " + sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        let customer_list = [];
        for (let index = 0; index < query.rows.length; index++) {
          customer_list.push(query.rows.item(index));
        }
        return customer_list;
        //return Promise.resolve(customer_list);
      }).catch(e => console.log(e));
    })

  }
  cupones_select(select:Array<{}> = [], where:Array<{}> = []){
    return this.isReady().then(()=>{
      var sql = 'SELECT ';

      // Select
      if (select.length > 0){
        for (let i = 0; i < select.length; i++) {
          const item_select = select[i];
          sql += item_select['value'];
    
          if (select.length > i + 1){
            sql += ", ";
          }
        }
      }
      else{
        sql += "*";
      }

      sql += ' FROM cupon WHERE';
      // Where
      if (where.length > 0){
        for (let i = 0; i < where.length; i++) {
          const item_where = where[i];
          sql += " " + item_where['key'] + " = " + item_where['value'];
          if (where.length > i + 1){
            sql += " AND ";
          }
        }
      }
      else{
        sql += " 1";
      }
     
      sql += ' ORDER BY status ASC';

      console.log("SQL: " + sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        let customer_list = [];
        for (let index = 0; index < query.rows.length; index++) {
          customer_list.push(query.rows.item(index));
        }
        return customer_list;
        //return Promise.resolve(customer_list);
      }).catch(e => console.log(e));
    })
  }

  cupon_select_id(idReservaDetalle: number){
    return this.isReady()
    .then(()=>{
      var sql = 'SELECT * FROM cupon WHERE idReservaDetalle = ' + idReservaDetalle;
      console.log(sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        return query.rows.item(0);
      }).catch(e => console.log(e));
    })
  }

  cupones_update(update:Array<{}>, where: Array<{}>, table = "cupon"){
    return this.isReady().then(()=>{
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
        sql += " AND ";
      }
    }
    console.log(sql);

    return this.database.executeSql(sql, [])
      .then((result)=>{
        console.log("Actulizacion Correcta: " + JSON.stringify(result));
        return result;
      }).catch(e => console.log(e));
    })
  }


  /* REPLY */
  reply_insert_service(replys: any, idReservaDetalle: number, poll_id: number, language_id: number, poll_name: string){
    for(var reply of replys){

      this.reply_insert_clousure(reply, idReservaDetalle, poll_id, language_id, poll_name);
    }
  }

  reply_insert_clousure(reply:any, idReservaDetalle: number, poll_id: number, language_id: number, poll_name: string){
    this.reply_insert(reply, idReservaDetalle, poll_id, language_id, poll_name)
    .then((poll_id) => {
      // Aqui codigo
      return poll_id;
    });
  }

  reply_insert(reply: any, idReservaDetalle: number, poll_id: number, language_id: number, poll_name: string){
    
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO reply (idReservaDetalle, poll_id, language_id, poll_name, question_id, question_name, question_type, answer_id, answer_name, is_sinc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      console.log("Reply: " +  sql);
      return this.database.executeSql(sql, [idReservaDetalle, poll_id, language_id, poll_name, reply.question_id, reply.question_name, reply.question_type, 0, reply.answer_name, 0])
      .then((result)=>{
        return result.insertId;
      }).catch(e => console.log("Error reply_insert: " + e));
    })
  }

  reply_update(reply_id: number){
    return this.isReady()
    .then(()=>{
      let sql = 'UPDATE reply SET is_sinc = 1 WHERE reply_id = ' + reply_id;
      console.log("Reply Update: " +  sql);
      return this.database.executeSql(sql, [])
      .then((result)=>{
        return result;
      }).catch(e => console.log("Error reply_update: " + e));
    })
  }

  reply_select(){
    return this.isReady().then(()=>{
      var sql = 'SELECT r.*, c.idReservaDetalle, c.email, c.phone, c.Huesped, c.signature_1, c.signature_2 FROM reply r\
      LEFT JOIN cupon c ON c.idReservaDetalle = r.idReservaDetalle\
      WHERE r.is_sinc = 0';
      console.log(sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        let lists = [] 
        for (let index = 0; index < query.rows.length; index++) {
          lists.push(query.rows.item(index));
        }
        return lists;
      }).catch(e => console.log(e));
    })
  }
  // ---

  /* ENCUESTAS */
  insert_sync_poll(list: any){
    for(var item_polls of list.data){
      for (let i = 0; i < item_polls.length; i++) {
        var item_poll = item_polls[i];
        // Inserto en la encuesta
        this.poll_insert_clousure(i, item_poll);
      }
    }
  }
  
  poll_select_by_id(poll_id: number, language_id: number){
    let data = [] 
    return this.isReady()
    .then(()=>{
      var sql = 'SELECT * FROM poll WHERE online_poll_id = ' + poll_id  + " AND language_id = " + language_id;
      console.log(sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        return query.rows.item(0);
      }).catch(e => console.log(e));
    })
  }

  poll_select(){
    return this.isReady().then(()=>{
      var sql = 'SELECT * FROM poll WHERE language_id = 1 GROUP BY online_poll_id';
      console.log(sql);
      return this.database.executeSql(sql, [])
      .then((query)=>{
        let lists = [] 
        for (let index = 0; index < query.rows.length; index++) {
          lists.push(query.rows.item(index));
        }
        
        return lists;
      }).catch(e => console.log(e));
    })
  }

  delete_poll(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('DELETE FROM poll', [])
    })
  }

  poll_select_all(poll_id:number, language_id: number){
    return this.isReady().then(()=>{
      var sql = "SELECT * FROM question WHERE poll_id = " + poll_id + " AND language_id = " + language_id;
      console.log(sql);
      return this.database.executeSql(sql, []).then((data)=>{
        let lists = [];
        for (let index = 0; index < data.rows.length; index++) {
          lists.push(data.rows.item(index));
        }
        return lists;
      })
    })
  }

  poll_insert_clousure(index: number, data:any){
    this.poll_insert(data.poll_id, data.language.language_id, data.language.name, data.color)
    .then((poll_id) => {
      for (let index_question = 0; index_question < data.questions.length; index_question++) {
        const questions = data.questions[index_question];
        this.question_insert_clousure(poll_id, questions, index_question);
      }
    });
  }

  poll_insert(online_poll_id: number, language_id: number, name: string, color: string){
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO poll (online_poll_id, language_id, name, color) VALUES (?, ?, ?, ?)';
      return this.database.executeSql(sql, [online_poll_id, language_id, name, color])
      .then((result)=>{
        return result.insertId;
      })
    })
  }
  // ---

  /* PREGUNTAS */
  select_question(){
    return this.isReady()
    .then(()=>{
      let sql = 'SELECT * FROM question';
      return this.database.executeSql(sql, [])
      .then((query)=>{
        let data = [] 
        for (let index = 0; index < query.rows.length; index++) {
          data.push(query.rows.item(index) );
        }
        return data;
      })
    })
  }

  delete_question(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('DELETE FROM question', [])
    })
  }

  question_insert_clousure(poll_id: number, data:any, index:number){
    console.log("index question: " + index);
    this.question_insert(poll_id, data.language_id, data.type, data.question)
      .then((question_id) => {
        
        for (let index_answer = 0; index_answer < data.answers.length; index_answer++) {
          const answer = data.answers[index_answer];
          this.answer_insert_clousure(question_id, answer, index_answer)
        }
    });
  }

  question_insert(poll_id: number, language_id: number, type: number, question: string){
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO question (poll_id, language_id, type, question) VALUES (?, ?, ?, ?)';
      return this.database.executeSql(sql, [poll_id, language_id, type, question])
      .then((result)=>{
        return result.insertId;
      })
    })
  }
  // ----

  /* ANSWERS DE QUESTION */
  answer_select(question_id: number){
    return this.isReady().then(()=>{
      let sql = 'SELECT * FROM answer WHERE question_id = ' + question_id;
      console.log(sql);
      return this.database.executeSql(sql, []).then((data)=>{
        let list = []
        for (let i = 0; i < data.rows.length; i++) {
          list.push(data.rows.item(i));
        }
        return list;
      })
    })
  }

  delete_answer(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('DELETE FROM answer', [])
    })
  }

  answer_insert_clousure(question_id: number, data:any, index:number){
    console.log("index answer: " + index);
    this.answer_insert(question_id, data.answer, data.type)
    .then((answer_id) => {
      console.log("answer_id" + answer_id);
      answer_id = answer_id;
    });
  }

  answer_insert(question_id: number, answer: string, type: number){
    return this.isReady()
    .then(()=>{
      let sql = 'INSERT INTO answer (question_id, answer, type) VALUES (?, ?, ?)';
      return this.database.executeSql(sql, [question_id, answer, type])
      .then((result)=>{
        return result.insertId;
      })
    })
  }

  delete_all_poll(){
    return this.isReady()
    .then(()=>{
      this.database.executeSql('DELETE FROM poll', [])
      .then(res => console.log('Executed SQL DELETE poll'))
      .catch(e => console.log(e));

      this.database.executeSql('DELETE FROM question', [])
      .then(res => console.log('Executed SQL DELETE question'))
      .catch(e => console.log(e));

      return this.database.executeSql('DELETE FROM answer', [])
      .then((result)=>{ console.log("Executed SQL DELETE answer"); })
    })
  }
  // ----

  sql_raw(sql: string){
    
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(sql, [])
      .then((data)=>{
        console.log(sql);
        console.log(data);
        let lists = [];
        for(let i=0; i<data.rows.length; i++){
          lists.push(data.rows.item(i));
        }
        return lists;
      }).catch(e => console.log(e));
    })
  }

  debug(sql: string){
    
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(sql, [])
      .then((data)=>{
        console.log(sql);
        console.log(data);
        let lists = [];
        for(let i=0; i<data.rows.length; i++){
          lists.push(data.rows.item(i));
        }
        return lists;
      }).catch(e => console.log(e));
    })
  }

  
}
