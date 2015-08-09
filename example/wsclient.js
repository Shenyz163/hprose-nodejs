/*jshint node:true, eqeqeq:true */
'use strict';

var hprose = require('../lib/hprose.js');
var client = hprose.Client.create('ws://127.0.0.1:8080', []);
client.keepAlive = false;
client.simple = true;
client.on('error', function(func, e) {
    console.log(func, e.stack);
});
var proxy = client.useService(['hello', 'hello2', 'getMaps']);
var start = new Date().getTime();
var max = 100;
var n = 0;
client.subscribe('news', function(result) {
    console.log(result);
});
var callback = function(result) {
    console.log(result);
    n++;
    if (n === max) {
        var end = new Date().getTime();
        console.log(end - start);
    }
};
for (var i = 0; i < max; i++) {
    proxy.hello(i, callback);
}
var end = new Date().getTime();
console.log(end - start);
client.batch.begin();
proxy.getMaps('name', 'age', 'age', function(result) {
    console.log(result);
});
proxy.getMaps('name', 'age', 'birthday', function(result) {
    console.log(hprose.BytesIO.toString(result));
    console.log(hprose.unserialize(result));
    console.log(hprose.serialize(hprose.unserialize(result)).toString());
}, hprose.Serialized);
client.batch.end();
