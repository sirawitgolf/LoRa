var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/LoRa';
var collections = ['LoRaData'];
//var option = {'author':{'user':'wu','password':'1234'}}

var connect = mongojs(databaseUrl);

module.exports = {
    connect: connect
};