# http-flow-visualizer

node module web app to visualize requests flow of an infra
made of a frontend `http-recorder` and a backend `http-replayer`.

It uses `javascript` to show a set of charts which describes
- keyspace length
- keyspace average size
- pending job sizes
- total query count
- query velocity within last second (+/-)

## install

    npm i maboiteaspam/http-flow-visualizer -g

## usage

    redis-server
    http-flow-visualizer [opts]

##### --verbose
More verbose.

##### --rport=`6379`
Redis port

##### --rhost=`0.0.0.0`
Redis host

##### --ropts=``
Redis options as a stringified json object

##### --port=`8081`
Web app http server port

##### --host=`127.0.0.1`
Web app http server host


## see also

- [http-recorder](https://github.com/maboiteaspam/http-recorder)
- [http-replayer](https://github.com/maboiteaspam/http-replayer)
