
var redis = require("redis");
var async = require("async");
var debug = require('debug')('http-flow-visualizer');

var JobsStats = function () {

  var that = this;
  var client;
  var updateInterval;

  this.start = function (opts) {
    if (client) return client
    client = redis.createClient(
      opts.rport || 6379,
      opts.rhost || '0.0.0.0',
      opts.ropts && JSON.parse(opts.ropts) || {
      });

    client.on('ready', function (){
      debug('client ready')
      updateCurrentStats()
    })
    return client
  };
  this.end = function () {
    client.end();
    clearInterval(updateInterval);
  };

  var currentStats = {
    jobs:{}
  };
  this.getStats = function () {
    return currentStats;
  }

  var isBusy = false;
  var noMoreBusy = function(){isBusy=false;setTimeout(updateCurrentStats, 900)};
  var updateCurrentStats = function () {
    if(isBusy) return;
    isBusy = true;

    var newStats = {
      jobs:{}
    };
    client.smembers('blockKeys', function (err, res) {
      var t = [];
      res.forEach(function(blockKey){
        t.push(function(next){
          client.llen('r'+blockKey, function (err, jobs) {
            newStats.jobs[blockKey] = jobs;
            next();
          });
        })
      });
      async.parallelLimit(t, 10, function () {
        currentStats = newStats;
        newStats = null;
        noMoreBusy()
      });

    });

  };

};

module.exports = JobsStats;