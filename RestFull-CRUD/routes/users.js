var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');

const config = {
  user: '4DD_04',  //Vostro user name
  password: 'xxx123##', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: '4DD_04', //(Nome del DB)
}

//Function to connect to database and execute query
let executeQuery = function (res, query, next, pageName) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      render(pageName,result.recordset,res); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      console.log(result);
      sql.close();
    });

  });
}

let render = function(pageName, data, res){
    res.render(pageName, {data : data })
}

let executeQuery1 = function (res, query, next) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      res.send(result.recordset);
      sql.close();
    });

  });
}


let executeQuery2 = function (res, query,index, next, pageName) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      render(pageName,result.recordset[index],res); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      console.log(result);
      sql.close();
    });

  });
}
/* GET users listing. */
router.get('/json', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery1(res, sqlQuery, next);
});


router.get('/search/:id', function (req, res, next) {
  let sqlQuery = `select * from dbo.[cr-unit-attributes]`;
  executeQuery2(res, sqlQuery,req.params.id, next, "details");
});

router.get('/all', function (req, res, next){
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next, "page") ;  
});
router.post('/', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body;
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed,Speed,Deploy_Time,Range,Target,Count,Transport,Type,Rarity) 
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}', '${unit.Speed}', '${unit.Deploy_Time}', '${unit.Range}', '${unit.Target}', '${unit.Count}', '${unit.Transport}', '${unit.Type}', '${unit.Rarity}')`;
  executeQuery(res, sqlInsert, next, "new_unit");
  res.send({success:true, message: "unità inserita con successo", unit: unit})
});

module.exports = router;
