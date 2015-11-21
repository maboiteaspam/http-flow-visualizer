#!/usr/bin/env node

var st = require('st')
var fs = require("fs");
var morgan = require("morgan");
var minimist = require('minimist')(process.argv.slice(2));

if (minimist.verbose || minimist.v)
  process.env['DEBUG'] = 'http-flow-visualizer';

var debug = require('debug')('http-flow-visualizer');
var opener = require("opener");

var JobStats = require("./index");

var puller = new JobStats();

puller.start(minimist)
console.log('started')

var express = require('express');
var app = express();

app.use(morgan());
var totalQueryCount = 0;
var queryCount = 0;
app.get('/', function (req, res) {
  queryCount++;
  res.status(200).end();
});
app.use(st({ path: __dirname + '/public', passthrough: true, url: '/',cache: {
  fd: {
    max: 1000,
    maxAge: 500
  }} }))
app.get('/fv/', function (req, res) {
  res.status(200).type('text/html').send(index).end();
});
app.get('/track', function (req, res) {
  queryCount++;
  res.status(200).type('text/html').end();
});
app.get('/stats', function (req, res) {
  var stats = puller.getStats()
  totalQueryCount+=queryCount
  stats.queryCount = queryCount;
  stats.totalQueryCount = totalQueryCount;
  queryCount = 0
  res.json(stats);
});
var server = app.listen(minimist.port || 8081, minimist.host || '127.0.0.1', function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

  opener("http://"+host+':'+port+'/index.html');
})

