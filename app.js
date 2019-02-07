var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('./db');
var converter = require('hex2dec')

var db = mongojs.connect;

var app = express();
app.use(bodyParser.json());

//Get all data
app.get('/getall', function (req, res) {
  db.data.find(function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})

//Get data by DevEui
app.get('/getdeveui/:id', function (req, res) {
  //var id = parseInt(req.params.id);
  
  db.data.findOne({
    DevEUI:req.params.id
  }, function (err, docs) {
    if (docs != null) {
      console.log('found', JSON.stringify(docs));
      res.json(docs);
    } else {
      res.send('-1');
      console.log(docs)
    }
  });
})

//Update data from LoRa in body
app.post('/updatebydeveui', function (req, res) {
  var json=req.body.DevEUI_uplink.payload_parsed
  /*let p_in=converter.hexToDec(json.DevEUI_uplink.payload_hex.slice(4,6))
  let p_out=converter.hexToDec(json.DevEUI_uplink.payload_hex.slice(10,12))
  let temp=converter.hexToDec(json.DevEUI_uplink.payload_hex.slice(16,20))/10
  let humit=converter.hexToDec(json.DevEUI_uplink.payload_hex.slice(-2))/2
  if(temp=='')temp=0
  if(humit=='')humit=0
  if(p_in=='')p_in=0
  if(p_out=='')p_out=0*/
  let time=req.body.DevEUI_uplink.Time.replace(/T/, ' ')
  let acc=json.slice(0,6)/100
  let gyro=json.slice(6)/100

  console.log('Get from Api', req.body);

  db.data.findAndModify({
    query: {
      DevEUI: req.body.DevEUI_uplink.DevEUI
    },
    update: {
      $set: {
        "dis_gyro":gyro,
        "dis_acce":acc,
        "Time":time
      }
    },
    new: true
  }, function (err, docs) {
    console.log('Update Done', docs);
    res.json(docs);
  });
})

//Add DevEui data
app.post('/adddeveui', function (req, res) {
  var json = req.body;
  db.data.insert(json, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})

//dropdatabase
app.get('/dropdata',(req,res)=>{
  db.data.remove((err,docs)=>{
   if(res.statusCode==200)res.send('drop ok')
   else res.send("can't drop")
  })
})

var server = app.listen(8100, function () {
  var port = server.address().port

  console.log("run at ", port)
})